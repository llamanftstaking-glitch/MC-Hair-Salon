"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";

interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    error_callback?: (err: { type?: string; message?: string }) => void;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      type?: "standard" | "icon";
      theme?: "outline" | "filled_blue" | "filled_black";
      size?: "large" | "medium" | "small";
      text?: "signin_with" | "signup_with" | "continue_with" | "signin";
      shape?: "rectangular" | "pill" | "circle" | "square";
      logo_alignment?: "left" | "center";
      width?: number | string;
    }
  ) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleAccountsId;
      };
    };
  }
}

export interface AuthCustomer {
  id: string; name: string; email: string; phone: string;
  stripeCustomerId?: string; stripePaymentMethodId?: string;
  avatarUrl?: string;
}

export default function GoogleSignInButton({
  mode = "signin",
  onSuccess,
}: {
  mode?: "signin" | "signup";
  onSuccess?: (customer: AuthCustomer) => void;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!scriptLoaded || !clientId || !window.google || !containerRef.current) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: GoogleCredentialResponse) => {
        setError("");
        setSubmitting(true);
        try {
          const res = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential: response.credential }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Google Sign-In failed");

          if (onSuccess) {
            // Stay on page — fetch full profile (includes Stripe card info) and pass to caller
            const profileRes = await fetch("/api/auth/me");
            const profile = await profileRes.json();
            onSuccess(profile);
          } else {
            const redirectTo = new URLSearchParams(window.location.search).get("redirect");
            router.push(redirectTo || (data.customer?.isAdmin ? "/admin" : "/account"));
          }
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : "Google Sign-In failed");
          setSubmitting(false);
        }
      },
      error_callback: (err) => {
        setSubmitting(false);
        if (err?.type === "popup_closed") {
          setError("Sign-in was cancelled. Please try again.");
        } else if (err?.type === "popup_failed_to_open") {
          setError("Couldn't open the Google sign-in window. Please allow pop-ups for this site and try again.");
        } else {
          setError(err?.message || "Google Sign-In failed. Please try again.");
        }
      },
    });

    // Size the official Google button to fit the parent (Google requires 200–400px).
    const containerWidth = containerRef.current.clientWidth || 360;
    const buttonWidth = Math.max(200, Math.min(400, Math.round(containerWidth)));

    containerRef.current.innerHTML = "";
    window.google.accounts.id.renderButton(containerRef.current, {
      type: "standard",
      theme: "filled_black",
      size: "large",
      text: mode === "signup" ? "signup_with" : "continue_with",
      shape: "rectangular",
      logo_alignment: "center",
      width: buttonWidth,
    });
  }, [scriptLoaded, clientId, mode, router, onSuccess]);

  if (!clientId) {
    return null;
  }

  return (
    <div className="space-y-3">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />

      <div className="flex justify-center">
        <div ref={containerRef} className={submitting ? "opacity-60 pointer-events-none" : ""} />
      </div>

      {submitting && (
        <p className="text-center text-[var(--mc-text-dim)] text-xs">Signing you in…</p>
      )}
      {error && <p className="text-center text-red-400 text-sm">{error}</p>}
      <p className="text-center text-[var(--mc-text-dim)] text-[11px] leading-snug">
        If the Google window doesn&apos;t appear, allow pop-ups for this site and try again.
      </p>
    </div>
  );
}
