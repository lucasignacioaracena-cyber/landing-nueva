import { useEffect, useState } from "react";

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

// Scroll only changes CSS variables; React updates when the visible section changes.
export default function useScrollExperience() {
  const [view, setView] = useState({
    activeSection: "inicio",
    pastHero: false,
    scrolled: false,
  });

  useEffect(() => {
    const root = document.documentElement;
    const main = document.querySelector("main");
    const hero = document.getElementById("inicio");
    const approach = document.getElementById("enfoque");
    const journey = document.getElementById("como-agendar");
    const presentation = document.getElementById("presentacion");
    const sections = [
      "inicio",
      "servicios",
      "enfoque",
      "como-agendar",
      "preguntas",
    ]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const revealSelector = [
      ".section-heading",
      ".service-filters",
      ".service-card",
      ".service-help",
      ".approach-art",
      ".approach-copy",
      ".center-heading",
      ".step",
      ".social-grid > div",
      ".faq-intro",
      ".faq-item",
      ".final-cta",
      ".video-intro",
      ".video-stage",
      ".video-aside",
      ".care-menu",
      ".care-panel",
      ".human-statement",
      ".human-copy",
      ".editorial-social",
    ].join(",");
    let frame = 0;
    let current = { activeSection: "inicio", pastHero: false, scrolled: false };
    let observer;

    const reveal = (element) => {
      element.classList.add("is-revealed");
      observer?.unobserve(element);
    };

    const prepareReveals = () => {
      if (!observer || preference.matches) return;
      main.querySelectorAll(revealSelector).forEach((element) => {
        if (element.classList.contains("scroll-reveal")) return;
        element.classList.add("scroll-reveal");
        if (element.matches(".service-card, .step")) {
          const index = [...element.parentElement.children].indexOf(element);
          element.style.setProperty("--reveal-delay", `${(index % 4) * 65}ms`);
        }
        if (element.getBoundingClientRect().top < window.innerHeight * 0.94) {
          reveal(element);
        } else {
          observer.observe(element);
        }
      });
    };

    const update = () => {
      frame = 0;
      const height = window.innerHeight;
      const scrollable = root.scrollHeight - height;
      root.style.setProperty(
        "--scroll-progress",
        String(scrollable > 0 ? clamp(window.scrollY / scrollable) : 0),
      );

      let activeSection = "inicio";
      for (const section of sections) {
        if (
          section.getBoundingClientRect().top <= Math.max(140, height * 0.3)
        ) {
          activeSection = section.id;
        }
      }
      const next = {
        activeSection,
        pastHero: Boolean(hero && hero.getBoundingClientRect().bottom < 100),
        scrolled: window.scrollY > 500,
      };
      if (Object.keys(next).some((key) => next[key] !== current[key])) {
        current = next;
        setView(next);
      }

      if (preference.matches) return;
      const heroProgress = clamp(
        window.scrollY / (hero?.offsetHeight || height),
      );
      root.style.setProperty("--hero-shift", `${heroProgress * 24}px`);
      root.style.setProperty("--hero-turn", `${heroProgress * 38}deg`);
      root.style.setProperty("--sticker-shift", `${heroProgress * -18}px`);
      if (presentation) {
        const rect = presentation.getBoundingClientRect();
        const progress = clamp((height - rect.top) / (height + rect.height));
        presentation.style.setProperty(
          "--video-shift",
          `${(progress - 0.5) * -20}px`,
        );
        presentation.style.setProperty(
          "--video-flower-turn",
          `${-12 + progress * 34}deg`,
        );
      }
      if (approach) {
        const rect = approach.getBoundingClientRect();
        const progress = clamp((height - rect.top) / (height + rect.height));
        approach.style.setProperty(
          "--flower-turn",
          `${-14 + progress * 48}deg`,
        );
      }
      if (journey) {
        const rect = journey.getBoundingClientRect();
        const progress = clamp(
          (height * 0.78 - rect.top) / (rect.height + height * 0.12),
        );
        journey.style.setProperty("--journey-progress", String(progress));
      }
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const configureMotion = () => {
      observer?.disconnect();
      root.classList.toggle(
        "motion-enabled",
        !preference.matches && "IntersectionObserver" in window,
      );
      if (preference.matches || !("IntersectionObserver" in window)) {
        root.style.removeProperty("--hero-shift");
        root.style.removeProperty("--hero-turn");
        root.style.removeProperty("--sticker-shift");
        presentation?.style.removeProperty("--video-shift");
        presentation?.style.removeProperty("--video-flower-turn");
        main.querySelectorAll(".scroll-reveal").forEach(reveal);
      } else {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) reveal(entry.target);
            });
          },
          { threshold: 0.08, rootMargin: "0px 0px -28px 0px" },
        );
        prepareReveals();
      }
      requestUpdate();
    };

    configureMotion();
    const mutations = new MutationObserver(prepareReveals);
    mutations.observe(main, { childList: true, subtree: true });
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    preference.addEventListener("change", configureMotion);
    update();

    return () => {
      observer?.disconnect();
      mutations.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      preference.removeEventListener("change", configureMotion);
      root.classList.remove("motion-enabled");
      [
        "--scroll-progress",
        "--hero-shift",
        "--hero-turn",
        "--sticker-shift",
      ].forEach((property) => root.style.removeProperty(property));
    };
  }, []);

  return view;
}
