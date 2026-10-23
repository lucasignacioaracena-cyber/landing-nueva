import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Flower2,
  Heart,
  Instagram,
  MessageCircle,
  Pause,
  Play,
  Plus,
  ShieldCheck,
  Sprout,
  X,
} from "lucide-react";
import Booking from "./Booking";
import { services, whatsapp } from "./content";

const BRAND = "matrona guía.";
const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const smoothstep = (n: number) => n * n * (3 - 2 * n);
const motionQuery = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const seenIntro = () => {
  try {
    return sessionStorage.getItem("matrona-intro-v2") === "seen";
  } catch {
    return false;
  }
};
const rememberIntro = () => {
  try {
    sessionStorage.setItem("matrona-intro-v2", "seen");
  } catch {
    /* local files can restrict session storage */
  }
};
const gallery = [
  {
    name: "Tu bienestar",
    line: "Conocer tu cuerpo es una forma de cuidarte.",
    note: "Información clara sobre tu salud íntima, tu ciclo y el autocuidado.",
    service: "ginecologia",
    video: "/videos/gallery-1.mp4",
    poster: "/images/gallery-1.jpg",
  },
  {
    name: "Tu voz",
    line: "Aquí, todas tus preguntas tienen un lugar.",
    note: "Un espacio para conversar con confianza y sin juicios.",
    service: "",
    video: "/videos/gallery-2.mp4",
    poster: "/images/gallery-2.jpg",
  },
  {
    name: "Tu etapa",
    line: "Acompañarte, en un momento de cambios.",
    note: "Orientación durante el embarazo y el postparto, respetando tu ritmo.",
    service: "maternidad",
    video: "/videos/gallery-3.mp4",
    poster: "/images/gallery-3.jpg",
  },
  {
    name: "Tus decisiones",
    line: "Tu cuerpo. Tus decisiones. Tu camino.",
    note: "Orientación sobre anticoncepción para decidir con información.",
    service: "anticoncepcion",
    video: "/videos/gallery-4.mp4",
    poster: "/images/gallery-4.jpg",
  },
  {
    name: "Tu momento",
    line: "El primer paso puede ser una conversación.",
    note: "Cuéntame qué necesitas y coordinemos tu consulta por WhatsApp.",
    service: "bienestar",
    video: "/videos/gallery-5.mp4",
    poster: "/images/gallery-5.jpg",
  },
];
const faqs = [
  [
    "¿Cómo agendo mi cita?",
    "Elige el motivo, una fecha y un horario preferidos. Al terminar, se abrirá WhatsApp con tu solicitud preparada. Envía el mensaje para coordinar y confirmar la atención personalmente.",
  ],
  [
    "¿La atención es presencial u online?",
    "Consulta por la modalidad y el lugar de atención disponibles en WhatsApp antes de confirmar tu cita.",
  ],
  [
    "¿Cómo conozco el valor de la consulta?",
    "Conversemos por WhatsApp para conocer el valor y los medios de pago antes de confirmar la atención.",
  ],
  [
    "¿Y si no sé qué consulta necesito?",
    "Puedes elegir “Necesito orientación” al agendar. Cuéntame qué necesitas y revisemos juntas el siguiente paso.",
  ],
];

function CountUp({
  end,
  label,
  reduced,
}: {
  end: number;
  label: string;
  reduced: boolean;
}) {
  const node = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(reduced ? end : 0);
  useEffect(() => {
    if (reduced) {
      setValue(end);
      return;
    }
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = clamp((now - start) / 2000);
          setValue(Math.round((1 - Math.pow(1 - p, 3)) * end));
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );
    if (node.current) observer.observe(node.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end, reduced]);
  return (
    <div className="mg-stat">
      <span className="mg-stat-number" ref={node} aria-hidden="true">
        {String(value).padStart(2, "0")}
      </span>
      <span className="sr-only">{end} </span>
      <span className="mg-stat-label">{label}</span>
    </div>
  );
}

export default function App() {
  const [reduced, setReduced] = useState(motionQuery);
  const [introDone, setIntroDone] = useState(
    () => motionQuery() || seenIntro(),
  );
  const [lifting, setLifting] = useState(introDone);
  const [heroReady, setHeroReady] = useState(introDone);
  const [letters, setLetters] = useState(0);
  const [cursor, setCursor] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOnDark, setNavOnDark] = useState(false);
  const [booking, setBooking] = useState<{ service: string } | null>(null);
  const [activeService, setActiveService] = useState(services[0].id);
  const [activeGallery, setActiveGallery] = useState(0);
  const [galleryReady, setGalleryReady] = useState(false);
  const [galleryInView, setGalleryInView] = useState(false);
  const [galleryPaused, setGalleryPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);
  const [frameReady, setFrameReady] = useState(false);
  const [mobile, setMobile] = useState(() => innerWidth < 768);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const darkRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const galleryButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const galleryVideos = useRef<(HTMLVideoElement | null)[]>([]);
  const selectedService = services.find((s) => s.id === activeService)!;
  const isStatic = reduced || videoFailed;

  const finishIntro = useCallback(() => {
    setLetters(BRAND.length);
    setCursor(false);
    setLifting(true);
    setHeroReady(true);
    setIntroDone(true);
    rememberIntro();
  }, []);

  const openBooking = useCallback(
    (service = "") => {
      if (menuOpen) {
        setMenuOpen(false);
        requestAnimationFrame(() => {
          menuButtonRef.current?.focus();
          setBooking({ service });
        });
      } else setBooking({ service });
    },
    [menuOpen],
  );
  const closeBooking = useCallback(() => setBooking(null), []);

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const size = matchMedia("(max-width: 767px)");
    const updateMotion = () => {
      setReduced(motion.matches);
      if (motion.matches) finishIntro();
    };
    const updateSize = () => {
      setMobile(size.matches);
      setFrameReady(false);
      setVideoFailed(false);
    };
    const visibility = () => setPageVisible(!document.hidden);
    motion.addEventListener("change", updateMotion);
    size.addEventListener("change", updateSize);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      motion.removeEventListener("change", updateMotion);
      size.removeEventListener("change", updateSize);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [finishIntro]);

  useEffect(() => {
    if (introDone || reduced) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    Array.from(BRAND).forEach((_, i) =>
      timers.push(setTimeout(() => setLetters(i + 1), 600 + i * 90)),
    );
    const liftAt = 600 + BRAND.length * 90 + 350;
    timers.push(setTimeout(() => setCursor(false), liftAt - 150));
    timers.push(setTimeout(() => setLifting(true), liftAt));
    timers.push(setTimeout(() => setHeroReady(true), liftAt + 950));
    timers.push(setTimeout(finishIntro, liftAt + 1600));
    return () => timers.forEach(clearTimeout);
  }, [introDone, reduced, finishIntro]);

  useEffect(() => {
    if (introDone) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [introDone]);

  useEffect(() => {
    if (!menuOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.focus();
    const key = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
      if (e.key !== "Tab") return;
      const controls = [
        menuButtonRef.current,
        ...Array.from(
          menuRef.current?.querySelectorAll<HTMLElement>("a[href], button") ||
            [],
        ),
      ].filter((n): n is HTMLElement => Boolean(n));
      const first = controls[0],
        last = controls.at(-1);
      if (
        e.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === menuRef.current)
      ) {
        e.preventDefault();
        last?.focus();
      } else if (
        !e.shiftKey &&
        (document.activeElement === last ||
          document.activeElement === menuRef.current)
      ) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener("keydown", key);
      menuButtonRef.current?.focus();
    };
  }, [menuOpen]);

  // Scroll owns both the floating composition and the paused video's timeline.
  useEffect(() => {
    let tick = 0,
      seek = 0,
      disposed = false,
      latest = 0;
    const video = videoRef.current;
    const seekToLatest = () => {
      seek = 0;
      if (
        disposed ||
        isStatic ||
        !introDone ||
        document.hidden ||
        !video ||
        video.readyState < 1 ||
        video.seeking ||
        !Number.isFinite(video.duration)
      )
        return;
      const target = latest * Math.max(0, video.duration - 1 / 30);
      if (Math.abs(video.currentTime - target) > 1 / 60)
        video.currentTime = target;
    };
    const queueSeek = () => {
      if (!seek) seek = requestAnimationFrame(seekToLatest);
    };
    const update = () => {
      tick = 0;
      if (
        !heroRef.current ||
        !darkRef.current ||
        !galleryRef.current ||
        !frameRef.current
      )
        return;
      const vw = innerWidth,
        vh = innerHeight;
      const hero = heroRef.current.getBoundingClientRect();
      const dark = darkRef.current.getBoundingClientRect();
      const tiles = galleryRef.current.getBoundingClientRect();
      setNavOnDark([dark, tiles].some((r) => r.top <= 0 && r.bottom > 0));
      const total = document.documentElement.scrollHeight - vh;
      document.documentElement.style.setProperty(
        "--mg-progress",
        String(clamp(scrollY / Math.max(1, total))),
      );
      if (isStatic) return;
      const landscape = vh <= 560 && vw > vh;
      const w = landscape
        ? vw * 0.4
        : vw < 768
          ? Math.min(vw - 48, 500)
          : Math.min(vw * 0.49, 740);
      const h = landscape
        ? vh * 0.72
        : vw < 768
          ? Math.min(vh * 0.43, 470)
          : Math.min(vh * 0.54, 600);
      const p = clamp(
        (-hero.top - hero.height * 0.3) /
          Math.max(1, hero.height * 0.7 + vh * 0.68),
      );
      const t = smoothstep(smoothstep(p));
      const startX = landscape ? vw - w - 24 : (vw - w) / 2,
        startY = vh - h - 18;
      const finalScale = 1.45;
      const endX = -w * finalScale * 0.72;
      const endY = vh * 0.43 - (h * finalScale) / 2;
      const x = startX + (endX - startX) * t;
      const y = startY + (endY - startY) * t;
      const scale = 1 + (finalScale - 1) * t;
      const opacity =
        vw < 768
          ? clamp(dark.top / (vh * 0.46))
          : clamp(tiles.top / (vh * 0.32));
      Object.assign(frameRef.current.style, {
        width: `${w}px`,
        height: `${h}px`,
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: String(opacity),
        visibility: opacity > 0 ? "visible" : "hidden",
      });
      frameRef.current.dataset.progress = p.toFixed(4);
      latest = p;
      queueSeek();
    };
    const requestUpdate = () => {
      if (!tick) tick = requestAnimationFrame(update);
    };
    const metadata = () => {
      video?.pause();
      requestUpdate();
    };
    const ready = () => {
      setFrameReady(true);
      queueSeek();
    };
    video?.addEventListener("loadedmetadata", metadata);
    video?.addEventListener("loadeddata", ready);
    video?.addEventListener("seeked", ready);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    document.addEventListener("visibilitychange", requestUpdate);
    const resize = new ResizeObserver(requestUpdate);
    [heroRef.current, darkRef.current, galleryRef.current].forEach(
      (n) => n && resize.observe(n),
    );
    if (video && video.readyState >= 2) ready();
    update();
    return () => {
      disposed = true;
      cancelAnimationFrame(tick);
      cancelAnimationFrame(seek);
      resize.disconnect();
      video?.removeEventListener("loadedmetadata", metadata);
      video?.removeEventListener("loadeddata", ready);
      video?.removeEventListener("seeked", ready);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      document.removeEventListener("visibilitychange", requestUpdate);
    };
  }, [mobile, isStatic, introDone]);

  useEffect(() => {
    const section = galleryRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setGalleryInView(entry.isIntersecting);
        if (entry.isIntersecting) setGalleryReady(true);
      },
      { rootMargin: "120px 0px", threshold: 0 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const play =
      galleryInView &&
      !galleryPaused &&
      !reduced &&
      pageVisible &&
      !booking &&
      !menuOpen;
    galleryVideos.current.forEach((video) => {
      if (!video) return;
      if (play)
        void video.play().catch(() => {
          /* poster remains when autoplay is unavailable */
        });
      else video.pause();
    });
  }, [
    galleryReady,
    galleryInView,
    galleryPaused,
    reduced,
    pageVisible,
    booking,
    menuOpen,
  ]);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(".mg-reveal");
    if (reduced) {
      nodes.forEach((n) => n.classList.add("mg-revealed"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("mg-revealed");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [reduced]);

  const navigateGallery = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % gallery.length;
    else if (event.key === "ArrowLeft")
      next = (index + gallery.length - 1) % gallery.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = gallery.length - 1;
    else return;
    event.preventDefault();
    setActiveGallery(next);
    galleryButtons.current[next]?.focus();
  };

  return (
    <>
      <div
        className={`mg-root ${isStatic ? "mg-static" : ""} ${heroReady ? "mg-hero-ready" : ""}`}
      >
        <a className="skip-link" href="#servicios">
          Saltar al contenido
        </a>
        {!introDone && (
          <div
            className={`mg-intro ${lifting ? "mg-intro-lifting" : ""}`}
            data-testid="intro"
          >
            <div className="mg-intro-lockup">
              <p aria-hidden="true">
                {BRAND.slice(0, letters)}
                {cursor && <span className="mg-cursor" />}
              </p>
              <span className="sr-only">Bienvenida a Matrona Guía</span>
              <span className="mg-intro-caption">
                TU BIENESTAR EMPIEZA CONTIGO
              </span>
            </div>
            <button className="mg-skip-intro" onClick={finishIntro}>
              Saltar intro <ArrowUpRight size={15} />
            </button>
          </div>
        )}

        <header
          className={`mg-nav ${navOnDark && !menuOpen ? "mg-nav-light" : ""} ${menuOpen ? "mg-nav-menu" : ""}`}
          inert={!introDone ? true : undefined}
        >
          <a
            href="#inicio"
            className="mg-logo"
            aria-label="Matrona Guía, inicio"
            onClick={() => setMenuOpen(false)}
          >
            <Flower2 size={26} strokeWidth={1.25} />
            matrona guía<span>.</span>
          </a>
          <div className="flex items-center gap-4 md:gap-8">
            <button
              className="mg-nav-book"
              aria-label="Agendar una cita"
              onClick={() => openBooking()}
            >
              <span>Agendar una cita</span>
              <ArrowUpRight size={17} />
            </button>
            <button
              ref={menuButtonRef}
              className="mg-menu-toggle"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              aria-controls="mg-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <X size={25} />
              ) : (
                <span aria-hidden="true">
                  <i />
                  <i />
                </span>
              )}
            </button>
          </div>
          <span className="mg-reading-progress" aria-hidden="true" />
        </header>

        {menuOpen && (
          <div
            className="mg-menu"
            id="mg-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mg-menu-heading"
            tabIndex={-1}
          >
            <span id="mg-menu-heading" className="mg-kicker">
              UN ESPACIO PARA TI
            </span>
            <nav aria-label="Navegación principal">
              {[
                ["inicio", "Inicio"],
                ["enfoque", "Mi enfoque"],
                ["servicios", "Tu bienestar"],
              ].map(([id, text], i) => (
                <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}>
                  <small>0{i + 1}</small>
                  {text}
                  <ArrowUpRight />
                </a>
              ))}
              <button onClick={() => openBooking()}>
                <small>04</small>Agendar
                <ArrowUpRight />
              </button>
            </nav>
            <a className="mg-menu-contact" href="tel:+56975898382">
              +56 9 7589 8382
            </a>
          </div>
        )}

        <div
          className={`mg-cinematic ${introDone ? "mg-cinematic-settled" : ""}`}
          ref={frameRef}
          aria-hidden="true"
        >
          <div
            className={`mg-cinematic-rise ${lifting ? "mg-cinematic-in" : ""}`}
          >
            <img
              src={
                mobile
                  ? "/images/scroll-poster-mobile.jpg"
                  : "/images/scroll-poster-desktop.jpg"
              }
              alt=""
              fetchPriority="high"
            />
            <video
              ref={videoRef}
              src={
                isStatic
                  ? undefined
                  : mobile
                    ? "/videos/scroll-film-mobile.mp4"
                    : "/videos/scroll-film-desktop.mp4"
              }
              muted
              playsInline
              preload={isStatic ? "none" : "auto"}
              disablePictureInPicture
              className={frameReady && !isStatic ? "mg-frame-ready" : ""}
              onError={() => setVideoFailed(true)}
            />
            <div className="mg-cinematic-shade" />
            <span className="mg-film-caption">
              <Heart size={13} /> Cuidado cercano. A tu ritmo.
            </span>
          </div>
        </div>

        <main inert={menuOpen || !introDone ? true : undefined}>
          <section
            className="mg-hero"
            id="inicio"
            ref={heroRef}
            tabIndex={-1}
            aria-labelledby="mg-hero-heading"
          >
            <div className="mg-hero-halo" aria-hidden="true" />
            <div className="mg-hero-text">
              <div className="mg-hero-top">
                <span className="mg-kicker">
                  SALUD FEMENINA · RESPETO · CERCANÍA
                </span>
                <span className="mg-hero-edition">CONTIGO, EN CADA ETAPA.</span>
              </div>
              <h1 id="mg-hero-heading">
                <span>TU BIENESTAR.</span>
                <span>
                  EMPIEZA EN <em>TI.</em>
                </span>
              </h1>
              <div className="mg-hero-mobile-copy">
                <p>
                  Un espacio para escucharte,
                  <br />
                  entenderte y cuidar de ti.
                </p>
                <button
                  className="mg-circle-link"
                  onClick={() => openBooking()}
                  aria-label="Agendar mi cita"
                >
                  <ArrowUpRight size={23} />
                </button>
              </div>
            </div>
            <div className="mg-hero-side">
              <p>
                Tu cuerpo tiene su historia.
                <br />
                Merece una guía cercana.
              </p>
              <button className="mg-text-link" onClick={() => openBooking()}>
                Agendar mi cita <ArrowUpRight size={17} />
              </button>
            </div>
            <a href="#enfoque" className="mg-discover">
              <span>DESLIZA PARA DESCUBRIR</span>
              <ArrowDown size={21} />
            </a>
            <span className="mg-hero-index" aria-hidden="true">
              01 — UN NUEVO COMIENZO
            </span>
          </section>

          <section
            className="mg-statement-wrap"
            id="enfoque"
            ref={darkRef}
            aria-labelledby="mg-statement-heading"
          >
            <div className="mg-statement">
              <div className="mg-statement-content">
                <span className="mg-kicker">MÁS QUE UNA CONSULTA</span>
                <h2 id="mg-statement-heading">
                  Hay preguntas que
                  <br />
                  merecen <em>tiempo.</em>
                  <br />Y una persona que
                  <br />
                  sepa <em>escucharte.</em>
                </h2>
                <p>
                  Información clara, sin juicios. Un acompañamiento que respeta
                  tus decisiones y entiende que cada etapa se vive de una manera
                  distinta.
                </p>
                <div className="mg-stats">
                  <CountUp
                    end={4}
                    label="áreas para acompañarte"
                    reduced={reduced}
                  />
                  <CountUp
                    end={3}
                    label="pasos para empezar"
                    reduced={reduced}
                  />
                  <CountUp
                    end={1}
                    label="conversación a tu ritmo"
                    reduced={reduced}
                  />
                </div>
                <a className="mg-text-link" href="#servicios">
                  Descubre cómo te acompaño <ArrowDownRight size={18} />
                </a>
              </div>
              <Flower2
                className="mg-statement-flower"
                strokeWidth={0.5}
                aria-hidden="true"
              />
            </div>
          </section>

          <section
            className="mg-gallery"
            id="momentos"
            ref={galleryRef}
            aria-labelledby="mg-gallery-heading"
          >
            <div className="mg-ticker" aria-hidden="true">
              <span>
                matrona guía. &nbsp; matrona guía. &nbsp; matrona guía. &nbsp;
                matrona guía.
              </span>
            </div>
            <div className="mg-gallery-content">
              <div className="mg-gallery-heading">
                <div>
                  <span className="mg-kicker">CADA PARTE DE TI IMPORTA</span>
                  <h2 id="mg-gallery-heading">
                    A tu manera.
                    <br className="mg-mobile-break" /> <em>A tu ritmo.</em>
                  </h2>
                </div>
                <button
                  className="mg-gallery-pause"
                  onClick={() => setGalleryPaused((p) => !p)}
                  disabled={reduced}
                  aria-pressed={galleryPaused || reduced}
                >
                  {galleryPaused || reduced ? (
                    <Play size={15} />
                  ) : (
                    <Pause size={15} />
                  )}
                  {reduced
                    ? "Movimiento reducido"
                    : galleryPaused
                      ? "Activar movimiento"
                      : "Pausar movimiento"}
                </button>
              </div>
              <div
                className="mg-gallery-row"
                role="group"
                aria-label="Explora los momentos de tu cuidado"
              >
                {gallery.map((item, index) => (
                  <button
                    key={item.name}
                    className={`mg-gallery-item ${index === activeGallery ? "mg-gallery-active" : ""}`}
                    ref={(n) => {
                      galleryButtons.current[index] = n;
                    }}
                    aria-label={`Explorar ${item.name.toLowerCase()}`}
                    aria-pressed={index === activeGallery}
                    aria-controls="mg-gallery-description"
                    onMouseEnter={() => {
                      if (matchMedia("(hover: hover)").matches)
                        setActiveGallery(index);
                    }}
                    onFocus={() => setActiveGallery(index)}
                    onClick={() => setActiveGallery(index)}
                    onKeyDown={(e) => navigateGallery(e, index)}
                  >
                    <img src={item.poster} alt="" loading="lazy" />
                    <video
                      ref={(n) => {
                        galleryVideos.current[index] = n;
                      }}
                      src={galleryReady && !reduced ? item.video : undefined}
                      poster={item.poster}
                      muted
                      loop
                      playsInline
                      preload="none"
                      aria-hidden="true"
                      onError={(e) => {
                        e.currentTarget.style.opacity = "0";
                      }}
                    />
                    <span className="mg-gallery-scrim" />
                    <span className="mg-gallery-number">0{index + 1}</span>
                    <span className="mg-gallery-label">
                      {item.name}
                      <ArrowUpRight size={18} />
                    </span>
                  </button>
                ))}
              </div>
              <div
                className="mg-gallery-description"
                id="mg-gallery-description"
                aria-live="polite"
              >
                <div>
                  <h3>{gallery[activeGallery].line}</h3>
                  <p>{gallery[activeGallery].note}</p>
                </div>
                <button
                  className="mg-text-link"
                  onClick={() => openBooking(gallery[activeGallery].service)}
                >
                  Conversemos <ArrowUpRight size={18} />
                </button>
              </div>
            </div>
          </section>

          <section
            className="mg-care mg-space"
            id="servicios"
            aria-labelledby="mg-care-heading"
          >
            <div className="mg-section-heading mg-reveal">
              <div>
                <span className="mg-kicker">ACOMPAÑAMIENTO A TU MEDIDA</span>
                <h2 id="mg-care-heading">
                  Cada etapa.
                  <br />
                  <em>Tu propia historia.</em>
                </h2>
              </div>
              <p>
                Encuentra un espacio para conversar,
                <br />
                entender y decidir con confianza.
              </p>
            </div>
            <div className="mg-care-layout mg-reveal">
              <div
                className="mg-care-menu"
                role="group"
                aria-label="Elegir área de acompañamiento"
              >
                {services.map((service, i) => (
                  <button
                    key={service.id}
                    aria-pressed={activeService === service.id}
                    aria-controls="mg-care-panel"
                    onClick={() => setActiveService(service.id)}
                  >
                    <small>0{i + 1}</small>
                    <span>{service.title}</span>
                    <ArrowUpRight size={20} />
                  </button>
                ))}
              </div>
              <div
                className="mg-care-panel"
                id="mg-care-panel"
                role="region"
                aria-label={selectedService.title}
              >
                <selectedService.Icon size={35} strokeWidth={1.15} />
                <h3>{selectedService.title}</h3>
                <p>{selectedService.description}</p>
                <ul>
                  {selectedService.points.map((point) => (
                    <li key={point}>
                      <Check size={16} />
                      {point}
                    </li>
                  ))}
                </ul>
                <button
                  className="mg-button"
                  onClick={() => openBooking(selectedService.id)}
                >
                  Consultar por esta atención <ArrowUpRight size={18} />
                </button>
              </div>
            </div>
          </section>

          <section
            className="mg-journey mg-space"
            id="como-agendar"
            aria-labelledby="mg-journey-heading"
          >
            <div className="mg-section-heading mg-reveal">
              <div>
                <span className="mg-kicker">EMPEZAR PUEDE SER SIMPLE</span>
                <h2 id="mg-journey-heading">
                  Un momento.
                  <br />
                  <em>Solo para ti.</em>
                </h2>
              </div>
              <p>
                Tu cita se coordina personalmente.
                <br />
                Sin pagos online, con atención cercana.
              </p>
            </div>
            <div className="mg-steps mg-reveal">
              {[
                {
                  n: "01",
                  Icon: Heart,
                  title: "Cuéntame qué necesitas",
                  text: "Elige el motivo de tu consulta o solicita orientación.",
                },
                {
                  n: "02",
                  Icon: CalendarDays,
                  title: "Encuentra tu momento",
                  text: "Indica una fecha y una franja horaria que te acomoden.",
                },
                {
                  n: "03",
                  Icon: MessageCircle,
                  title: "Coordinemos juntas",
                  text: "Envía tu solicitud por WhatsApp y confirma los detalles.",
                },
              ].map(({ n, Icon, title, text }) => (
                <div key={n}>
                  <div className="mg-step-top">
                    <span>{n}</span>
                    <Icon size={25} strokeWidth={1.2} />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
            <button className="mg-button" onClick={() => openBooking()}>
              Agendar mi cita <ArrowUpRight size={18} />
            </button>
          </section>

          <section
            className="mg-faq mg-space"
            id="preguntas"
            aria-labelledby="mg-faq-heading"
          >
            <div className="mg-faq-intro mg-reveal">
              <span className="mg-kicker">UN POCO MÁS DE TRANQUILIDAD</span>
              <h2 id="mg-faq-heading">
                Preguntar también
                <br />
                es <em>cuidarte.</em>
              </h2>
              <a
                className="mg-text-link"
                href={whatsapp()}
                target="_blank"
                rel="noopener noreferrer"
              >
                Hacer otra pregunta <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="mg-faq-list mg-reveal">
              {faqs.map(([q, a], i) => (
                <div className="mg-faq-item" key={q}>
                  <h3>
                    <button
                      aria-expanded={openFaq === i}
                      aria-controls={`mg-faq-${i}`}
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      {q}
                      <Plus
                        size={19}
                        className={openFaq === i ? "mg-rotated" : ""}
                      />
                    </button>
                  </h3>
                  <div id={`mg-faq-${i}`} hidden={openFaq !== i}>
                    <p>{a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            className="mg-final"
            id="contacto"
            aria-labelledby="mg-final-heading"
          >
            <span className="mg-kicker">ESTE ESPACIO TAMBIÉN ES TUYO</span>
            <h2 id="mg-final-heading">
              Empecemos con
              <br />
              una <em>conversación.</em>
            </h2>
            <button
              className="mg-final-button"
              onClick={() => openBooking()}
              aria-label="Agendar una cita con Matrona Guía"
            >
              <ArrowUpRight size={39} />
            </button>
            <div className="mg-final-bottom">
              <p>
                Tu bienestar merece tiempo,
                <br />
                escucha y una guía cercana.
              </p>
              <a href={whatsapp()} target="_blank" rel="noopener noreferrer">
                Escribir por WhatsApp <ArrowUpRight size={18} />
              </a>
            </div>
            <Flower2
              className="mg-final-flower"
              strokeWidth={0.5}
              aria-hidden="true"
            />
          </section>
        </main>

        <footer
          className="mg-footer mg-space"
          inert={menuOpen || !introDone ? true : undefined}
        >
          <div className="mg-footer-top">
            <a
              href="#inicio"
              className="mg-logo"
              aria-label="Matrona Guía, volver al inicio"
            >
              <Flower2 size={26} strokeWidth={1.25} />
              matrona guía<span>.</span>
            </a>
            <a href="tel:+56975898382">+56 9 7589 8382</a>
            <div className="mg-socials">
              <a
                href="https://www.instagram.com/matronaguia/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram <Instagram size={17} />
              </a>
              <a
                href="https://www.tiktok.com/@matronaguia"
                target="_blank"
                rel="noopener noreferrer"
              >
                TikTok <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
          <div className="mg-footer-bottom">
            <span>© {new Date().getFullYear()} Matrona Guía.</span>
            <span>Contigo, en cada etapa.</span>
            <span>La información no reemplaza una evaluación profesional.</span>
          </div>
        </footer>
      </div>
      {booking && (
        <Booking initialService={booking.service} onClose={closeBooking} />
      )}
    </>
  );
}
