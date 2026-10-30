"use client";

import Form from "next/form";

// The "Para sa'yo ba?" filter form. Leaves "Anywhere / Any course / Any year"
// out of the URL, so links shared to group chats stay short.
export function AudienceForm({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Form
      action="/"
      scroll={false}
      className={className}
      onSubmit={(event) => {
        const empty = [...event.currentTarget.querySelectorAll("select")].filter((s) => !s.value);
        for (const select of empty) select.disabled = true;
        // The form stays on screen after the soft navigation; turn them back on.
        setTimeout(() => empty.forEach((s) => (s.disabled = false)));
      }}
    >
      {children}
    </Form>
  );
}
