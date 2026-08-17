"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      className="btn btn-dark !py-2"
      onClick={() => window.print()}
    >
      Print / save PDF
    </button>
  );
}
