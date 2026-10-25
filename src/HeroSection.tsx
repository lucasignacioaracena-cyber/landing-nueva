import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Menu,
  MessageCircle,
  Pause,
  Play,
  X,
} from "lucide-react";
import { profile, whatsapp } from "./content";
import "./hero-section.css";

type HeroSectionProps = { onBook: () => void; suspended?: boolean };
const links = [
  { label: "Sobre mí", href: "#camila" },
  { label: "Servicios", href: "#servicios" },
  { label: "Valores", href: "#valores" },
  { label: "Experiencias", href: "#experiencias" },
  { label: "Blog", href: "#blog" },
];

export default function HeroSection({
  onBook,
  suspended = false,
}: HeroSectionProps) {
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [mobile, setMobile] = useState(
    () => matchMedia("(max-width: 767px)").matches,
  );
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const source = mobile
    ? "/videos/scroll-film-mobile.mp4"
    : "/videos/scroll-film-desktop.mp4";
  const poster = mobile
    ? "/images/scroll-poster-mobile.jpg"
    : "/images/scroll-poster-desktop.jpg";
  const photo = "/images/retrato-camila-rojas.jpeg";

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const size = matchMedia("(max-width: 767px)");
    const onMotion = () => setReduced(motion.matches);
    const onSize = () => {
      setMobile(size.matches);
      setFailed(false);
      setReady(false);
      if (!size.matches) setOpen(false);
    };
    const onVisibility = () => setPageVisible(!document.hidden);
    motion.addEventListener("change", onMotion);
    size.addEventListener("change", onSize);
    document.addEventListener("visibilitychange", onVisibility);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.12 },
    );
    if (section.current) observer.observe(section.current);
    return () => {
      motion.removeEventListener("change", onMotion);
      size.removeEventListener("change", onSize);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (
      reduced ||
      failed ||
      paused ||
      !visible ||
      !pageVisible ||
      open ||
      suspended
    ) {
      el.pause();
      return;
    }
    el.muted = true;
    void el.play().catch(() => {
      /* The poster remains visible if autoplay is unavailable. */
    });
  }, [reduced, failed, paused, visible, pageVisible, open, mobile, suspended]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    close.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab") return;
      const nodes = Array.from(
        menu.current?.querySelectorAll<HTMLElement>(
          "a[href],button:not([disabled])",
        ) || [],
      );
      const first = nodes[0],
        last = nodes.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", key);
      toggle.current?.focus({ preventScroll: true });
    };
  }, [open]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;
      target.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
      if (!target.hasAttribute("tabindex"))
        target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  };

  return (
    <section
      className="matrona-hero relative h-screen w-full overflow-hidden"
      id="inicio"
      ref={section}
      aria-labelledby="matrona-hero-title"
      tabIndex={-1}
    >
      <div className="mh-media" aria-hidden="true">
        <img className="mh-poster" src={poster} alt="" fetchPriority="high" />
        <video
          ref={video}
          className={`mh-video ${ready ? "mh-video-ready" : ""}`}
          src={reduced || failed ? undefined : source}
          poster={poster}
          autoPlay={!reduced}
          muted
          loop
          playsInline
          preload={reduced ? "none" : "auto"}
          tabIndex={-1}
          disablePictureInPicture
          onLoadedData={() => setReady(true)}
          onError={() => {
            setReady(false);
            setFailed(true);
          }}
        />
      </div>
      <div className="mh-shade" aria-hidden="true" />
      <div className="mh-mobile-blend" aria-hidden="true" />
      <div className="mh-main" inert={open ? true : undefined}>
        <header className="mh-header flex items-center justify-between px-6 md:px-8 lg:px-16 pt-6 md:pt-8 lg:pt-12">
          <a
            href="#inicio"
            className="mh-wordmark"
            aria-label="Matrona Guía, inicio"
          >
            <span>MATRONAGUÍA</span>
            <span>Matrona Camila Rojas</span>
          </a>
          <nav
            className="mh-nav hidden md:flex"
            aria-label="Navegación principal"
          >
            {links.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className={i === 0 ? "mh-nav-active" : ""}
                onClick={(e) => go(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            className="mh-contact group hidden md:inline-flex"
            href="#contacto"
            onClick={(e) => go(e, "#contacto")}
          >
            Contacto
            <span className="group-hover:scale-110">
              <ArrowUpRight size={20} />
            </span>
          </a>
          <button
            ref={toggle}
            className="mh-menu-toggle md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={open}
            aria-controls="mh-menu"
          >
            <Menu className={open ? "mh-toggle-hidden" : ""} size={28} />
            <X className={!open ? "mh-toggle-hidden" : ""} size={28} />
          </button>
        </header>
        <div className="mh-heading px-6 md:px-8 lg:px-16 max-w-3xl mt-8 md:mt-6 lg:mt-10">
          <span className="mh-eyebrow">ÑUÑOA · ONLINE PARA TODO CHILE</span>
          <h1 id="matrona-hero-title">
            <span>Tu salud.</span>
            <span>Tu tiempo.</span>
            <span className="mh-last-line">
              Tu guía.
              <span
                className="mh-avatar-group hidden md:inline-flex"
                aria-hidden="true"
              >
                <img src={photo} alt="" />
                <span>
                  Camila
                  <br />
                  <strong>Rojas</strong>
                </span>
              </span>
            </span>
          </h1>
          <p className="mh-subtext hidden md:block">
            Un espacio para <strong>informarte y cuidarte</strong>, con
            acompañamiento cercano en cada etapa.{" "}
            <strong>Ciencia y corazón.</strong>
          </p>
          <div className="mh-heading-actions">
            <button className="mh-book" onClick={onBook}>
              Agenda tu atención
              <span>
                <ArrowUpRight size={20} />
              </span>
            </button>
            <a
              href={whatsapp()}
              target="_blank"
              rel="noopener noreferrer"
              className="mh-direct-whatsapp"
              aria-label="Escribir a Camila por WhatsApp"
            >
              <MessageCircle size={21} />
            </a>
          </div>
        </div>
        <div className="mh-figure hidden md:block">
          <div className="mh-figure-stat">
            <strong>USS 2024</strong>
            <span>Distinción Máxima</span>
          </div>
          <img
            src={photo}
            alt="Matrona Camila Rojas con uniforme rosado y un modelo de útero tejido"
            loading="eager"
          />
          <span className="mh-figure-caption">
            {profile.fullName}
            <small>Matrona · {profile.university}</small>
          </span>
        </div>
        <div className="mh-bottom">
          <a
            href="#servicios"
            onClick={(e) => go(e, "#servicios")}
            className="mh-scroll"
          >
            Conoce mis servicios <ArrowDown size={17} />
          </a>
          <button
            className="mh-motion"
            disabled={reduced || failed}
            onClick={() => setPaused((v) => !v)}
            aria-pressed={paused || reduced || failed}
          >
            {paused || reduced || failed ? (
              <Play size={14} />
            ) : (
              <Pause size={14} />
            )}
            <span>
              {reduced || failed
                ? "Imagen estática"
                : paused
                  ? "Activar movimiento"
                  : "Pausar movimiento"}
            </span>
          </button>
        </div>
      </div>
      {open && (
        <div
          className="mh-menu-overlay"
          id="mh-menu"
          ref={menu}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de Matrona Guía"
        >
          <button
            ref={close}
            className="mh-menu-close"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          >
            <X size={28} />
          </button>
          <span className="mh-menu-label">MATRONAGUÍA</span>
          <nav aria-label="Navegación móvil">
            {links.map((link, i) => (
              <a
                href={link.href}
                key={link.href}
                onClick={(e) => go(e, link.href)}
                style={{ animationDelay: `${100 + i * 60}ms` }}
              >
                {link.label}
                <ArrowUpRight size={22} />
              </a>
            ))}
          </nav>
          <a
            className="mh-contact"
            href="#contacto"
            onClick={(e) => go(e, "#contacto")}
          >
            Contacto
            <span>
              <ArrowUpRight size={20} />
            </span>
          </a>
        </div>
      )}
    </section>
  );
}
