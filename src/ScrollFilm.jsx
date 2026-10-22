import React, { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  Flower2,
  Heart,
} from "lucide-react";
import "./scroll-film.css";

const CHAPTERS = [
  {
    name: "Bienestar",
    eyebrow: "UN ESPACIO SEGURO PARA TI",
    lines: ["Tu bienestar", "merece una", "guía cercana."],
    italic: [2],
    description:
      "Salud femenina con información clara, escucha y el tiempo que mereces.",
  },
  {
    name: "Escucha",
    eyebrow: "AQUÍ PUEDES SER TÚ",
    lines: ["Un espacio", "para", "escucharte."],
    italic: [2],
    description:
      "Aquí puedes preguntar con confianza. Tu historia y tus decisiones importan.",
  },
  {
    name: "Tu etapa",
    eyebrow: "TU CUERPO. TUS DECISIONES.",
    lines: ["Contigo,", "en cada", "etapa."],
    italic: [1, 2],
    description:
      "Un cuidado cercano, que se adapta a tu momento y respeta tu propio ritmo.",
  },
  {
    name: "Tu cita",
    eyebrow: "ESTE MOMENTO ES PARA TI",
    lines: ["Empecemos", "por ti."],
    italic: [1],
    description:
      "Demos el primer paso juntas. Conversemos y coordinemos tu consulta por WhatsApp.",
  },
];

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const motionPreference = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobilePreference = () => window.matchMedia("(max-width: 700px)").matches;

export default function ScrollFilm({ onBook }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const videoRef = useRef(null);
  const navRef = useRef(null);
  const progressRef = useRef(0);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(motionPreference);
  const [mobile, setMobile] = useState(mobilePreference);
  const [failed, setFailed] = useState(false);
  const [frameReady, setFrameReady] = useState(false);
  const isStatic = reducedMotion || failed;
  const source = mobile
    ? "/videos/scroll-film-mobile.mp4"
    : "/videos/scroll-film-desktop.mp4";
  const poster = mobile
    ? "/images/scroll-poster-mobile.jpg"
    : "/images/scroll-poster-desktop.jpg";
  const chapter = CHAPTERS[active];

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const size = window.matchMedia("(max-width: 700px)");
    const updateMotion = () => setReducedMotion(motion.matches);
    const updateSize = () => {
      setMobile(size.matches);
      setFailed(false);
      setFrameReady(false);
    };
    motion.addEventListener("change", updateMotion);
    size.addEventListener("change", updateSize);
    return () => {
      motion.removeEventListener("change", updateMotion);
      size.removeEventListener("change", updateSize);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    let tickFrame = 0;
    let seekFrame = 0;
    let disposed = false;

    const headerHeight = () =>
      document.querySelector(".header")?.getBoundingClientRect().height ||
      (mobile ? 72 : 84);

    // Only one seek is in flight. seeked always catches up to the latest scroll
    // position, rather than replaying a queue of obsolete requests.
    const flushSeek = () => {
      seekFrame = 0;
      if (
        disposed ||
        isStatic ||
        document.hidden ||
        !video ||
        video.readyState < 1 ||
        video.seeking
      )
        return;
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      const target = progressRef.current * Math.max(0, video.duration - 1 / 30);
      if (Math.abs(video.currentTime - target) < 1 / 60) return;
      try {
        video.currentTime = target;
      } catch (error) {
        if (error.name !== "InvalidStateError") setFailed(true);
      }
    };

    const requestSeek = () => {
      if (!seekFrame) seekFrame = window.requestAnimationFrame(flushSeek);
    };

    const update = () => {
      tickFrame = 0;
      if (disposed || isStatic) return;
      const rect = section.getBoundingClientRect();
      const range = Math.max(1, section.offsetHeight - stage.offsetHeight);
      const progress = clamp((headerHeight() - rect.top) / range);
      progressRef.current = progress;
      section.style.setProperty("--film-progress", String(progress));
      section.style.setProperty("--film-turn", `${-12 + progress * 52}deg`);
      section.dataset.progress = progress.toFixed(4);
      const next = Math.min(3, Math.floor(progress * 4));
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
      requestSeek();
    };

    const requestUpdate = () => {
      if (!tickFrame) tickFrame = window.requestAnimationFrame(update);
    };
    const onMetadata = () => {
      if (disposed) return;
      video.pause();
      video.muted = true;
      requestUpdate();
      requestSeek();
    };
    const onFrame = () => {
      if (disposed) return;
      setFrameReady(true);
      requestSeek();
    };
    const onFailure = () => {
      if (!disposed) setFailed(true);
    };
    const onVisibility = () => {
      if (!document.hidden) requestUpdate();
    };

    if (isStatic) {
      video?.pause();
      section.style.setProperty(
        "--film-progress",
        String(activeRef.current / 3),
      );
      section.style.removeProperty("--film-turn");
      section.dataset.progress = String(activeRef.current / 3);
    } else {
      video?.addEventListener("loadedmetadata", onMetadata);
      video?.addEventListener("loadeddata", onFrame);
      video?.addEventListener("seeked", onFrame);
      video?.addEventListener("canplay", requestSeek);
      video?.addEventListener("error", onFailure);
      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", requestUpdate, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      if (video?.readyState >= 1) onMetadata();
      if (video?.readyState >= 2) onFrame();
      update();
    }
    const resizeObserver =
      "ResizeObserver" in window ? new ResizeObserver(requestUpdate) : null;
    resizeObserver?.observe(section);
    resizeObserver?.observe(stage);
    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      window.cancelAnimationFrame(tickFrame);
      window.cancelAnimationFrame(seekFrame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      document.removeEventListener("visibilitychange", onVisibility);
      video?.removeEventListener("loadedmetadata", onMetadata);
      video?.removeEventListener("loadeddata", onFrame);
      video?.removeEventListener("seeked", onFrame);
      video?.removeEventListener("canplay", requestSeek);
      video?.removeEventListener("error", onFailure);
      video?.pause();
    };
  }, [mobile, isStatic]);

  const goToChapter = (index) => {
    if (isStatic) {
      activeRef.current = index;
      progressRef.current = index / 3;
      setActive(index);
      sectionRef.current.style.setProperty(
        "--film-progress",
        String(index / 3),
      );
      sectionRef.current.dataset.progress = String(index / 3);
      return;
    }
    const section = sectionRef.current;
    const stage = stageRef.current;
    const header =
      document.querySelector(".header")?.getBoundingClientRect().height || 84;
    const start = window.scrollY + section.getBoundingClientRect().top - header;
    const range = Math.max(1, section.offsetHeight - stage.offsetHeight);
    // Stay just inside the final chapter so its CTA remains in the viewport.
    const point = [0, 0.34, 0.67, 0.985][index];
    window.scrollTo({ top: start + range * point, behavior: "smooth" });
  };

  const navigateChapters = (event, index) => {
    let next;
    if (event.key === "ArrowRight") next = Math.min(3, index + 1);
    if (event.key === "ArrowLeft") next = Math.max(0, index - 1);
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = 3;
    if (next === undefined) return;
    event.preventDefault();
    goToChapter(next);
    navRef.current
      ?.querySelectorAll("button")
      [next]?.focus({ preventScroll: true });
  };

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className={`scroll-film ${isStatic ? "film-static" : ""}`}
      data-mode={isStatic ? "static" : "scroll"}
      data-chapter={active + 1}
      data-progress="0"
      aria-labelledby="film-heading"
      tabIndex={-1}
    >
      <div className="film-sticky" ref={stageRef}>
        <div className="film-media" aria-hidden="true">
          <img
            className="film-poster"
            src={poster}
            alt=""
            fetchPriority="high"
          />
          <video
            ref={videoRef}
            className={`film-video ${frameReady && !isStatic ? "film-frame-ready" : ""}`}
            src={isStatic ? undefined : source}
            poster={poster}
            muted
            playsInline
            preload={isStatic ? "none" : "auto"}
            disablePictureInPicture
            tabIndex={-1}
            aria-hidden="true"
          />
          <div className="film-image-wash" />
          <span className="film-image-note">
            <Heart size={14} /> Cuidado cercano. A tu ritmo.
          </span>
        </div>

        <div className="film-content">
          <div className="film-overline">
            <Flower2 size={17} strokeWidth={1.3} />
            <span>MATRONA GUÍA · SALUD CON CALIDEZ</span>
          </div>

          <div className="film-copy-block" key={active}>
            <span className="film-chapter-eyebrow">{chapter.eyebrow}</span>
            <h1 id="film-heading">
              {chapter.lines.map((line, index) => (
                <span
                  key={line}
                  className={
                    chapter.italic.includes(index) ? "film-italic" : undefined
                  }
                >
                  {line}
                </span>
              ))}
            </h1>
            <p>{chapter.description}</p>
          </div>

          <div className="film-actions">
            <button type="button" className="button film-book" onClick={onBook}>
              Agendar mi cita <ArrowUpRight size={19} />
            </button>
            <a href="#servicios" className="film-skip">
              Ver servicios <ArrowDownRight size={17} />
            </a>
          </div>

          <div className="film-footer">
            <nav
              className="film-chapter-nav"
              ref={navRef}
              aria-label="Etapas de Matrona Guía"
            >
              {CHAPTERS.map((item, index) => (
                <button
                  type="button"
                  key={item.name}
                  aria-label={`Ir a la etapa ${index + 1}: ${item.name}`}
                  aria-current={active === index ? "step" : undefined}
                  onClick={() => goToChapter(index)}
                  onKeyDown={(event) => navigateChapters(event, index)}
                >
                  <span className="film-chapter-number">0{index + 1}</span>
                  <span className="film-chapter-name">{item.name}</span>
                </button>
              ))}
            </nav>
            <div className="film-scroll-cue">
              <ArrowDown size={14} />
              <span>
                {isStatic
                  ? "Descubre cada etapa con los botones"
                  : "Desliza para descubrir"}
              </span>
              <span className="film-current-count">
                0{active + 1} <span>/ 04</span>
              </span>
            </div>
          </div>
        </div>

        <Flower2
          className="film-decoration"
          strokeWidth={0.65}
          aria-hidden="true"
        />
        <div className="film-timeline" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
