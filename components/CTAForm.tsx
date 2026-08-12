"use client";

import { FormEvent, useState } from "react";

type Fields = "name" | "email" | "whatsapp" | "business" | "url";
type Errors = Partial<Record<Fields, string>>;

export default function CTAForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries()) as Record<string, string>;
    const next: Errors = {};
    if (!values.name?.trim()) next.name = "Please enter your full name.";
    if (!values.email?.trim()) next.email = "Please enter your active email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Please enter a valid email address.";
    if (!values.whatsapp?.trim()) next.whatsapp = "Please enter your WhatsApp number.";
    else if (values.whatsapp.replace(/\D/g, "").length < 7) next.whatsapp = "Please enter a valid WhatsApp number.";
    if (!values.business?.trim()) next.business = "Please enter your business name.";
    if (values.url?.trim()) {
      try { new URL(values.url); } catch { next.url = "Please enter a complete URL, including https://"; }
    }
    setErrors(next);
    if (Object.keys(next).length) return;
    setSubmitError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Submission failed.");
      window.location.assign("/thank-you");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We could not submit your request. Please try again.");
      setSubmitting(false);
    }
  }

  const fieldClass = "mt-2 min-h-14 w-full rounded-xl border border-[#3d2424]/15 bg-white px-4 text-base text-[#3d2424] outline-none transition placeholder:text-[#755e58]/60 focus:border-[#bc4f4f] focus:ring-4 focus:ring-[#bc4f4f]/10";

  return (
    <section id="consultation" className="section-pad scroll-mt-4 bg-[linear-gradient(180deg,#fffaf1,#f3cd97)]">
      <div className="container-shell grid items-start gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-8">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[.14em] text-[#bc4f4f]">Book the call</p>
          <h2 className="display text-4xl font-black md:text-6xl">One-to-One Consultation</h2>
          <p className="mt-5 max-w-md text-base leading-7 text-[#5f4540]">Get a <strong>Customized AI Marketing Strategy for Your Business</strong> based on your current marketing situation and goals.</p>
          <div className="mt-7 flex items-center gap-3 text-sm font-bold text-[#755e58]"><span className="grid size-9 place-items-center rounded-full bg-white">✓</span> Free and customized for your business</div>
        </div>

        <form className="card bg-white p-5 sm:p-8 md:p-10" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full Name" name="name" placeholder="Enter your full name" error={errors.name} inputClass={fieldClass} autoComplete="name" />
            <Field label="Active Email" name="email" type="email" placeholder="Enter your active email" error={errors.email} inputClass={fieldClass} autoComplete="email" />
            <Field label="WhatsApp Number" name="whatsapp" type="tel" placeholder="Enter your WhatsApp number" error={errors.whatsapp} inputClass={fieldClass} autoComplete="tel" />
            <Field label="Business Name" name="business" placeholder="Enter your business name" error={errors.business} inputClass={fieldClass} autoComplete="organization" />
          </div>
          <div className="mt-5"><Field label="Website or Facebook URL" name="url" type="url" placeholder="https://yourwebsite.com" error={errors.url} inputClass={fieldClass} required={false} autoComplete="url" /></div>
          <div className="mt-5">
            <label className="text-sm font-extrabold" htmlFor="message">Anything You Want to Say</label>
            <textarea id="message" name="message" rows={4} className={`${fieldClass} resize-y py-4`} placeholder="Tell me about your current marketing challenge" />
          </div>
          <button className="cta mt-6 w-full disabled:cursor-wait disabled:opacity-70" disabled={submitting} type="submit">{submitting ? "Submitting…" : "Book My Free Consultation"} <span aria-hidden="true">→</span></button>
          {submitError && <p className="mt-4 rounded-xl bg-[#bc4f4f]/10 p-3 text-center text-sm font-semibold text-[#a53636]" role="alert">{submitError}</p>}
          <p className="mt-4 text-center text-xs font-semibold text-[#755e58]">🔒 We respect your privacy. No spam.</p>
        </form>
      </div>
    </section>
  );
}

function Field({ label, name, placeholder, error, inputClass, type = "text", required = true, autoComplete }: { label: string; name: Fields; placeholder: string; error?: string; inputClass: string; type?: string; required?: boolean; autoComplete?: string }) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label className="text-sm font-extrabold" htmlFor={name}>{label}{required && <span className="text-[#bc4f4f]"> *</span>}</label>
      <input id={name} name={name} type={type} placeholder={placeholder} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className={`${inputClass} ${error ? "border-[#bc4f4f]" : ""}`} />
      {error && <p className="mt-1.5 text-xs font-semibold text-[#a53636]" id={errorId}>{error}</p>}
    </div>
  );
}
