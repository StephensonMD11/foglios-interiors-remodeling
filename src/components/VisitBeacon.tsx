"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Logs one visit per browser session on public marketing pages. */
export function VisitBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/p/") ||
      pathname.startsWith("/api")
    ) {
      return;
    }
    if (sessionStorage.getItem("foglios-visit")) return;

    fetch("/api/stats/visit", { method: "POST", keepalive: true })
      .catch(() => {})
      .finally(() => {
        sessionStorage.setItem("foglios-visit", "1");
      });
  }, [pathname]);

  return null;
}
