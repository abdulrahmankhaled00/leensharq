"use client";

import { useEffect } from "react";

/**
 * Fades [data-reveal] elements in as they enter the viewport.
 *
 * - Content is only hidden once this component is running (html.reveal-ready), so a failed or
 *   late script can never leave a section blank.
 * - A MutationObserver picks up [data-reveal] nodes that appear later (route changes, hot reload).
 * - Printing reveals everything.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );

    const watch = (el: Element) => {
      if (!el.classList.contains("is-in")) io.observe(el);
    };
    const scan = (node: ParentNode) => {
      if (node instanceof Element && node.hasAttribute("data-reveal")) watch(node);
      node.querySelectorAll("[data-reveal]").forEach(watch);
    };

    scan(document);
    root.classList.add("reveal-ready");

    const mo = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => n instanceof Element && scan(n));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const showAll = () => document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
    window.addEventListener("beforeprint", showAll);

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("beforeprint", showAll);
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
