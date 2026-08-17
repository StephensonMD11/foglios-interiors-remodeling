"use client";

import { useState, type FormEvent } from "react";
import { sendContactInquiry } from "@/lib/email";
import { siteConfig } from "@/lib/site";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle",
  );
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = new FormData(e.currentTarget);
    const result = await sendContactInquiry({
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      county: String(form.get("county") || ""),
      projectType: String(form.get("projectType") || ""),
      message: String(form.get("message") || ""),
    });
    if (result.ok) {
      setStatus("ok");
      e.currentTarget.reset();
    } else {
      setStatus("err");
      setError(result.error);
    }
  }

  if (status === "ok") {
    return (
      <div className="border border-[color:var(--line)] bg-white p-8">
        <p className="font-display text-2xl text-[color:var(--ink)]">
          Thank you — message received.
        </p>
        <p className="mt-3 text-[color:var(--slate)]">
          We&apos;ll follow up soon about your project.
        </p>
        <button
          type="button"
          className="btn btn-dark mt-6"
          onClick={() => setStatus("idle")}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 border border-[color:var(--line)] bg-white p-6 md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--slate)]">
            Name
          </span>
          <input
            name="name"
            required
            className="w-full border border-[color:var(--line)] bg-[color:var(--cream)] px-3 py-3 outline-none focus:border-[color:var(--oak)]"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--slate)]">
            Email
          </span>
          <input
            name="email"
            type="email"
            required
            className="w-full border border-[color:var(--line)] bg-[color:var(--cream)] px-3 py-3 outline-none focus:border-[color:var(--oak)]"
          />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--slate)]">
            Phone
          </span>
          <input
            name="phone"
            type="tel"
            className="w-full border border-[color:var(--line)] bg-[color:var(--cream)] px-3 py-3 outline-none focus:border-[color:var(--oak)]"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--slate)]">
            County
          </span>
          <select
            name="county"
            className="w-full border border-[color:var(--line)] bg-[color:var(--cream)] px-3 py-3 outline-none focus:border-[color:var(--oak)]"
            defaultValue=""
          >
            <option value="" disabled>
              Select county
            </option>
            {siteConfig.serviceArea.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--slate)]">
          Project type
        </span>
        <select
          name="projectType"
          className="w-full border border-[color:var(--line)] bg-[color:var(--cream)] px-3 py-3 outline-none focus:border-[color:var(--oak)]"
          defaultValue="Bathroom remodel"
        >
          <option>Bathroom remodel</option>
          <option>Flooring</option>
          <option>Bathroom + flooring</option>
          <option>Other / not sure</option>
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--slate)]">
          Tell us about the project
        </span>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full resize-y border border-[color:var(--line)] bg-[color:var(--cream)] px-3 py-3 outline-none focus:border-[color:var(--oak)]"
        />
      </label>
      {status === "err" ? (
        <p className="text-sm text-red-700">{error}</p>
      ) : null}
      <button
        type="submit"
        className="btn btn-primary w-full md:w-auto"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
