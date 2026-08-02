"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";

const consentKey = "bluedot-analytics-consent";
const analyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "G-41SSBBDE6V";

type Consent = "accepted" | "declined" | null;

export default function AnalyticsConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = window.localStorage.getItem(consentKey);
      if (stored === "accepted" || stored === "declined") {
        setConsent(stored);
      }
      setReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const choose = (value: Exclude<Consent, null>) => {
    window.localStorage.setItem(consentKey, value);
    setConsent(value);
  };

  return (
    <>
      {consent === "accepted" && <GoogleAnalytics gaId={analyticsId} />}
      {ready && consent === null && (
        <div
          className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-3xl rounded-2xl border border-white/15 bg-black/95 p-5 shadow-2xl backdrop-blur-xl"
          role="dialog"
          aria-labelledby="analytics-consent-title"
          aria-describedby="analytics-consent-description"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h2 id="analytics-consent-title" className="font-bold text-white">
                Optional analytics
              </h2>
              <p id="analytics-consent-description" className="text-sm text-base-content/70">
                BlueDot can use Google Analytics to understand which public pages are useful. It stays off unless you accept.{" "}
                <Link href="/legal/privacy" className="text-primary hover:underline">Privacy details</Link>
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                type="button"
                onClick={() => choose("declined")}
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest border border-white/15 hover:border-white"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => choose("accepted")}
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-white text-black hover:bg-primary"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
      {ready && consent !== null && (
        <button
          type="button"
          onClick={() => {
            window.localStorage.removeItem(consentKey);
            setConsent(null);
          }}
          className="fixed bottom-3 left-3 z-[90] rounded-full border border-white/15 bg-black/80 px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-wider text-white/75 backdrop-blur hover:text-white"
        >
          Analytics settings
        </button>
      )}
    </>
  );
}
