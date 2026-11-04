// The curator's check before a shared or pasted post becomes a listing
// (terms §5; final decisions §1f).
const CHECKS = [
  "The opportunity is open to the public. From a private group or chat? Find a public source or ask the organizer.",
  "Source = the organizer's own post or page. Apply = their registration form or page.",
  "Summary in our own words: no copied caption, no names, numbers, or photos of people from the post.",
  "Don't upload their poster or pubmat; link to it.",
];

export function PublishChecklist() {
  return (
    <details className="mt-3 rounded-ui border border-line bg-card px-3 py-2 text-sm text-ink">
      <summary className="cursor-pointer font-semibold">Before you publish</summary>
      <ul className="mt-2 list-disc pl-5 text-muted">
        {CHECKS.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </details>
  );
}
