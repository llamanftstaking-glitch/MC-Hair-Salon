"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem("mc-sid");
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem("mc-sid", id);
    }
    return id;
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const sid = getSessionId();
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sid, type: "view", path: pathname }),
    }).catch(() => {});

    const interval = setInterval(() => {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, type: "heartbeat" }),
      }).catch(() => {});
    }, 30_000);

    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
