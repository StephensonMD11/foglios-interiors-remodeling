import type { ReactNode } from "react";

export function AdminTip({
  title = "How this works",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <details className="admin-tip">
      <summary>{title}</summary>
      <div className="admin-tip-body">{children}</div>
    </details>
  );
}
