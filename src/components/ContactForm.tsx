"use client";

import { useState, type FormEvent } from "react";
import { sendContactInquiry } from "@/lib/email";
import { siteConfig } from "@/lib/site";

const PROJECT_TYPES = [
  "Bathroom remodel",
  "Flooring",
  "Kitchen flooring",
  "Kitchen backsplash",
  "Other / not listed",
] as const;

const OTHER_COUNTY = "Other";
const OTHER_PROJECT = "Other / not listed";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle",
  );
  const [error, setError] = useState("");
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const [county, setCounty] = useState("");
  const [projectType, setProjectType] = useState<string>("Bathroom remodel");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = new FormData(e.currentTarget);

    const countySelect = String(form.get("county") || "");
    const countyOther = String(form.get("countyOther") || "").trim();
    const resolvedCounty =
      countySelect === OTHER_COUNTY
        ? countyOther
          ? `Other: ${countyOther}`
          : OTHER_COUNTY
        : countySelect;

    const projectSelect = String(form.get("projectType") || "");
    const projectOther = String(form.get("projectTypeOther") || "").trim();
    const resolvedProjectType =
      projectSelect === OTHER_PROJECT
        ? projectOther
          ? `Other: ${projectOther}`
          : OTHER_PROJECT
        : projectSelect;

    const result = await sendContactInquiry({
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      county: resolvedCounty,
      projectType: resolvedProjectType,
      message: String(form.get("message") || ""),
      company: String(form.get("company") || ""),
      formStartedAt,
    });
    if (result.ok) {
      setStatus("ok");
      e.currentTarget.reset();
      setCounty("");
      setProjectType("Bathroom remodel");
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
          We&apos;ll follow up soon about your project. You should also get a
          short confirmation email shortly.
        </p>
        <button
          type="button"
          className="btn btn-dark mt-6"
          onClick={() => {
            setFormStartedAt(Date.now());
            setStatus("idle");
          }}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 border border-[color:var(--line)] bg-white p-6 md:p-8"
    >
      {/* Honeypot for bots — hidden from people, not display:none */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
      >
        <label>
          Company
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--slate)]">
            Name
          </span>
          <input
            name="name"
            required
            autoComplete="name"
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
            autoComplete="email"
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
            autoComplete="tel"
            className="w-full border border-[color:var(--line)] bg-[color:var(--cream)] px-3 py-3 outline-none focus:border-[color:var(--oak)]"
          />
        </label>
        <div className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--slate)]">
              County
            </span>
            <select
              name="county"
              className="w-full border border-[color:var(--line)] bg-[color:var(--cream)] px-3 py-3 outline-none focus:border-[color:var(--oak)]"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
            >
              <option value="" disabled>
                Select county
              </option>
              {siteConfig.serviceArea.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value={OTHER_COUNTY}>{OTHER_COUNTY}</option>
            </select>
          </label>
          {county === OTHER_COUNTY ? (
            <label className="block text-sm">
              <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--slate)]">
                Your county
              </span>
              <input
                name="countyOther"
                required
                placeholder="County not listed"
                className="w-full border border-[color:var(--line)] bg-[color:var(--cream)] px-3 py-3 outline-none focus:border-[color:var(--oak)]"
              />
            </label>
          ) : null}
        </div>
      </div>
      <div className="space-y-4">
        <label className="block text-sm">
          <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--slate)]">
            Project type
          </span>
          <select
            name="projectType"
            className="w-full border border-[color:var(--line)] bg-[color:var(--cream)] px-3 py-3 outline-none focus:border-[color:var(--oak)]"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
          >
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        {projectType === OTHER_PROJECT ? (
          <label className="block text-sm">
            <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--slate)]">
              What are you inquiring about?
            </span>
            <input
              name="projectTypeOther"
              required
              placeholder="Describe the project type"
              className="w-full border border-[color:var(--line)] bg-[color:var(--cream)] px-3 py-3 outline-none focus:border-[color:var(--oak)]"
            />
          </label>
        ) : null}
      </div>
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
