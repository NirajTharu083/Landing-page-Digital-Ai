"use client";

import { useEffect, useRef, useState } from "react";

const FLODESK_ROOT = ".ff-6a76ee9522ed8801a56acba8";

function decodeConfig(value: string) {
  const bytes = Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>;
}

function encodeConfig(value: Record<string, unknown>) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary);
}

export default function CTAForm() {
  const embedHost = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const host = embedHost.current;
    if (!host) return;
    let cancelled = false;
    let redirectTimer: ReturnType<typeof setTimeout> | undefined;
    let observer: MutationObserver | undefined;
    let submittedLead: Record<string, string> | undefined;
    let spreadsheetSyncStarted = false;

    const captureLead = (event: Event) => {
      if (!(event.target instanceof HTMLFormElement)) return;
      const fields = new FormData(event.target);
      submittedLead = {
        name: String(fields.get("firstName") ?? ""),
        email: String(fields.get("email") ?? ""),
        whatsapp: String(fields.get("fields.whatsappNumber") ?? ""),
        business: String(fields.get("fields.businessName") ?? ""),
        url: String(fields.get("fields.websiteLink") ?? ""),
        message: String(fields.get("fields.") ?? ""),
      };
    };

    host.addEventListener("submit", captureLead, true);

    async function syncSpreadsheetAfterFlodeskSuccess() {
      if (spreadsheetSyncStarted) return;
      spreadsheetSyncStarted = true;
      const minimumDelay = new Promise((resolve) => setTimeout(resolve, 1800));

      try {
        if (!submittedLead) throw new Error("Submitted form values were unavailable.");
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const response = await fetch("/api/consultation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submittedLead),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (!response.ok) throw new Error("Spreadsheet sync failed.");
      } catch (error) {
        console.error(error);
      }

      await minimumDelay;
      window.location.assign("/thanks");
    }

    async function mountFlodesk() {
      try {
        const response = await fetch("/flodesk-form.html");
        if (!response.ok) throw new Error("Unable to load the Flodesk form.");
        const embedHtml = await response.text();
        if (cancelled || !host) return;

        host.innerHTML = embedHtml;
        const root = host.querySelector<HTMLElement>(FLODESK_ROOT);
        const configElement = root?.querySelector<HTMLElement>("[data-ff-el='config']");
        const encodedConfig = configElement?.getAttribute("data-ff-config");
        if (!root || !configElement || !encodedConfig) throw new Error("The Flodesk embed is incomplete.");

        // Flodesk must finish its own submission and enter its native success
        // stage before this site performs the delayed /thanks redirect.
        const config = decodeConfig(encodedConfig);
        config.onSuccess = { mode: "message", message: "", redirectUrl: "" };
        configElement.setAttribute("data-ff-config", encodeConfig(config));

        observer = new MutationObserver(() => {
          if (root.getAttribute("data-ff-stage") !== "success" || redirectTimer) return;
          redirectTimer = setTimeout(() => void syncSpreadsheetAfterFlodeskSuccess(), 0);
        });
        observer.observe(root, { attributes: true, attributeFilter: ["data-ff-stage"] });

        // Scripts inserted through innerHTML do not execute automatically.
        // Recreate the supplied script tags unchanged so Flodesk's native
        // loader, tracking, capture, and automation flow all remain active.
        for (const oldScript of Array.from(host.querySelectorAll("script"))) {
          const script = document.createElement("script");
          for (const attribute of Array.from(oldScript.attributes)) {
            script.setAttribute(attribute.name, attribute.value);
          }
          script.text = oldScript.text;
          oldScript.replaceWith(script);
        }

        host.dataset.flodeskReady = "true";
      } catch (error) {
        console.error(error);
        if (!cancelled) setLoadError(true);
      }
    }

    mountFlodesk();
    return () => {
      cancelled = true;
      observer?.disconnect();
      host.removeEventListener("submit", captureLead, true);
      if (redirectTimer) clearTimeout(redirectTimer);
      host.innerHTML = "";
    };
  }, []);

  return (
    <section id="consultation" className="section-pad scroll-mt-4 bg-[linear-gradient(180deg,#fffaf1,#f3cd97)]">
      <div className="container-shell grid items-start gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-8">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[.14em] text-[#bc4f4f]">Book the call</p>
          <h2 className="display text-4xl font-black md:text-6xl">One-to-One Consultation</h2>
          <p className="mt-5 max-w-md text-base leading-7 text-[#5f4540]">Get a <strong>Customized AI Marketing Strategy for Your Business</strong> based on your current marketing situation and goals.</p>
          <div className="mt-7 flex items-center gap-3 text-sm font-bold text-[#755e58]"><span className="grid size-9 place-items-center rounded-full bg-white">✓</span> Free and customized for your business</div>
        </div>

        <div className="flodesk-theme card min-w-0 bg-white p-5 sm:p-8 md:p-10">
          <div ref={embedHost} aria-live="polite">
            {!loadError && <p className="py-8 text-center text-sm font-semibold text-[#755e58]">Loading secure consultation form…</p>}
          </div>
          {loadError && <p className="rounded-xl bg-[#bc4f4f]/10 p-4 text-center text-sm font-semibold text-[#a53636]" role="alert">The consultation form could not load. Please refresh the page and try again.</p>}
          <p className="mt-4 text-center text-xs font-semibold text-[#755e58]">🔒 We respect your privacy. No spam.</p>
        </div>
      </div>
    </section>
  );
}
