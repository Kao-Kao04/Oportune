// Browser checks for scrolling, navigation, and click behavior (UX regressions).
// Needs a running app and Chrome/Chromium:
//   npm run build && npm start            (in another terminal)
//   npm run ux:check -- http://localhost:3000
// CHROME_PATH overrides the browser location.
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const chrome =
  process.env.CHROME_PATH ??
  [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].find((p) => existsSync(p));
if (!chrome) {
  console.error("Chrome not found; set CHROME_PATH.");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 9500 + Math.floor(Math.random() * 400);
const proc = spawn(
  chrome,
  ["--headless=new", "--disable-gpu", `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "uxc-"))}`, "about:blank"],
  { stdio: "ignore" },
);

let target;
for (let i = 0; i < 60 && !target; i++) {
  await sleep(200);
  try {
    target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page");
  } catch {}
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (pending.has(m.id)) {
    pending.get(m.id)(m.result);
    pending.delete(m.id);
  }
});
const send = (method, params = {}) =>
  new Promise((r) => {
    pending.set(++id, r);
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expression) =>
  (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }))?.result?.value;
const open = async (path) => {
  await send("Page.navigate", { url: base + path });
  await sleep(2500);
};
const setWidth = (width, mobile) =>
  send("Emulation.setDeviceMetricsOverride", { width, height: mobile ? 800 : 900, deviceScaleFactor: 1, mobile });

await send("Page.enable");
// Real-browser user agent so analytics bot filtering doesn't change behavior.
await send("Emulation.setUserAgentOverride", { userAgent: "Mozilla/5.0 (Linux; Android 13) Chrome/130 Mobile Safari/537.36" });

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`  ${ok ? "✓" : "✗"} ${name}${detail ? ` (${detail})` : ""}`);
  if (!ok) failures++;
}

const WIDTHS = [
  [360, true],
  [390, true],
  [768, false],
  [1280, false],
  [1440, false],
];

for (const [width, mobile] of WIDTHS) {
  console.log(`\n${width}px`);
  await setWidth(width, mobile);

  for (const path of ["/", "/?category=ctfs", "/opportunities/hkcert-ctf-2026-qualifying-round", "/sign-in"]) {
    await open(path);
    const overflow = await evaluate("document.documentElement.scrollWidth - window.innerWidth");
    check(`${path}: no horizontal page overflow`, overflow <= 0, `${overflow}px`);
  }

  // Fixed bottom nav must not cover the last controls on the page.
  await open("/");
  const covered = await evaluate(`(async () => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 400));
    const links = [...document.querySelectorAll("body > footer a")];
    return links.filter((a) => {
      const r = a.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return !(hit && (hit === a || a.contains(hit)));
    }).length;
  })()`);
  check("bottom nav doesn't cover footer links", covered === 0, `${covered} covered`);

  // The selected category chip is visible inside its row.
  await open("/?category=ctfs");
  const chipVisible = await evaluate(`(() => {
    const chip = document.querySelector('nav[aria-label="Categories"] [aria-current="page"]');
    if (!chip) return false;
    const row = chip.parentElement.getBoundingClientRect();
    const r = chip.getBoundingClientRect();
    return r.left >= row.left - 1 && r.right <= row.right + 1;
  })()`);
  check("selected category chip is visible", chipVisible === true);

  // Chips can be reached without horizontal scrolling on desktop (mouse wheel).
  if (!mobile) {
    const chipsHidden = await evaluate(`(() => {
      const row = document.querySelector('nav[aria-label="Categories"]');
      return row.scrollWidth - row.clientWidth;
    })()`);
    check("desktop: all category chips visible without sideways scrolling", chipsHidden <= 0, `${chipsHidden}px hidden`);
  }

  // Changing a filter keeps the page where it was (no jump to the top).
  await open("/");
  // Measured as where the chip row sits on screen, which is what the eye follows.
  const jump = await evaluate(`(async () => {
    const chipsTop = () => document.querySelector('nav[aria-label="Categories"]').getBoundingClientRect().top;
    window.scrollTo(0, chipsTop() + window.scrollY - 100);
    await new Promise((r) => setTimeout(r, 300));
    const before = Math.round(chipsTop());
    document.querySelector('nav[aria-label="Categories"] a[href*="category="]').click();
    await new Promise((r) => setTimeout(r, 3000));
    return { before, after: Math.round(chipsTop()), url: location.search };
  })()`);
  check("category change keeps the chips in place", jump && jump.url.includes("category=") && Math.abs(jump.after - jump.before) < 40, JSON.stringify(jump));

  // Search submits without a full page reload and keeps the category.
  await open("/?category=ctfs");
  const search = await evaluate(`(async () => {
    window.__marker = 1;
    const input = document.querySelector("#search");
    input.value = "ctf";
    input.form.requestSubmit();
    await new Promise((r) => setTimeout(r, 3000));
    return { kept: window.__marker === 1, url: location.search };
  })()`);
  check("search is a client navigation (no reload)", search?.kept === true, JSON.stringify(search));
  check("search keeps the selected category", search?.url.includes("category=ctfs") && search?.url.includes("q=ctf"));

  // The search field isn't hidden under the sticky header after the header search link.
  await open("/?category=ctfs");
  const hidden = await evaluate(`(async () => {
    window.scrollTo(0, 2000);
    await new Promise((r) => setTimeout(r, 300));
    document.querySelector('header a[aria-label="Search opportunities"]').click();
    await new Promise((r) => setTimeout(r, 2500));
    const input = document.querySelector("#search");
    const header = document.querySelector("header").getBoundingClientRect();
    const r = input.getBoundingClientRect();
    return { below: r.top >= header.bottom - 1, focused: document.activeElement === input, url: location.search };
  })()`);
  check("header search reveals the search field below the header", hidden?.below === true, JSON.stringify(hidden));

  // Back from a listing returns to the same filtered list.
  await open("/?category=ctfs");
  const back = await evaluate(`(async () => {
    document.querySelector('a[href^="/opportunities/"]').click();
    await new Promise((r) => setTimeout(r, 3000));
    const backLink = [...document.querySelectorAll("main a")].find((el) => el.textContent.trim().endsWith("Back") && el.textContent.trim().length < 8);
    backLink.click();
    await new Promise((r) => setTimeout(r, 3000));
    return location.pathname + location.search;
  })()`);
  check("detail back link returns to the filtered list", back === "/?category=ctfs", back);
}

ws.close();
proc.kill();
console.log(`\n${failures === 0 ? "All UX checks passed." : `${failures} UX check(s) failed.`}`);
process.exit(failures === 0 ? 0 : 1);
