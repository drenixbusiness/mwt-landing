"use client";

import { useEffect } from "react";

const stripHash = () => history.replaceState(history.state, "", location.pathname + location.search);

/**
 * Keeps "#section" out of the address bar: same-page anchor links scroll
 * without changing the URL, and a hash arriving from another page
 * ("/#faq") is scrolled to and then removed.
 */
export function HashLinks() {
  useEffect(() => {
    if (location.hash) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) setTimeout(() => target.scrollIntoView({ behavior: "instant" }), 0);
      stripHash();
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href);
      if (!url.hash || url.origin !== location.origin || url.pathname !== location.pathname) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;

      e.preventDefault();
      const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
      if (target.id === "main") {
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
      if (location.hash) stripHash();
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
