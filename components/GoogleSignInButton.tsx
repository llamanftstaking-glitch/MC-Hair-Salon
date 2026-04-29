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

export default function GoogleSignInButton({ mode = "signin" }: { mode?: "signin" | "signup" }) {
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
          router.push("/account");
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : "Google Sign-In failed");
          setSubmitting(false);
        }
      },
    });

    containerRef.current.innerHTML = "";
    window.google.accounts.id.renderButton(containerRef.current, {
      type: "standard",
      theme: "filled_black",
      size: "large",
      text: mode === "signup" ? "signup_with" : "continue_with",
      shape: "rectangular",
      logo_alignment: "center",
      width: 360,
    });
  }, [scriptLoaded, clientId, mode, router]);

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

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-[var(--mc-border)]" />
        <span className="mx-4 text-[var(--mc-text-dim)] text-xs uppercase tracking-widest">or</span>
        <div className="flex-grow border-t border-[var(--mc-border)]" />
      </div>

      <div className="flex justify-center">
        <div ref={containerRef} className={submitting ? "opacity-60 pointer-events-none" : ""} />
      </div>

      {submitting && (
        <p className="text-center text-[var(--mc-text-dim)] text-xs">Signing you in…</p>
      )}
      {error && <p className="text-center text-red-400 text-sm">{error}</p>}
    </div>
  );
}
