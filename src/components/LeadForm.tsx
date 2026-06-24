"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/config/active-site";

// Future: POST to /api/newsletter backed by PostgreSQL (pg + Flyway migrations).
// Store leads in a `newsletter_subscribers` table and connect to your email provider.

export function LeadForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // UI-only for now — no backend call yet
    setSubmitted(true);
  }

  return (
    <section
      id="newsletter"
      className="py-16 md:py-20"
      aria-labelledby="newsletter-heading"
    >
      <div className="mx-auto max-w-xl px-4 text-center">
        <h2
          id="newsletter-heading"
          className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
        >
          {siteConfig.newsletter.title}
        </h2>
        <p className="mt-3 text-slate-600">{siteConfig.newsletter.description}</p>

        {submitted ? (
          <p
            className="mt-8 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800"
            role="status"
          >
            {siteConfig.newsletter.successMessage}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {siteConfig.newsletter.buttonText}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
