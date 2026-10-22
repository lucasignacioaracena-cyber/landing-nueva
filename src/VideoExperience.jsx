import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  ExternalLink,
  Flower2,
  Heart,
  MonitorPlay,
  Pause,
  Play,
  Plus,
  ShieldCheck,
  Smartphone,
  Volume2,
  VolumeX,
} from "lucide-react";
import "./video.css";

const FORMATS = {
  horizontal: {
    label: "Horizontal",
    src: "/videos/presentacion-horizontal.mp4",
    poster: "/images/video-horizontal.jpg",
    Icon: MonitorPlay,
  },
  vertical: {
    label: "Vertical",
    src: "/videos/presentacion-vertical.mp4",
    poster: "/images/video-vertical.jpg",
    Icon: Smartphone,
  },
};

export default function VideoExperience({ onBook }) {
  const [format, setFormat] = useState("horizontal");
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ended, setEnded] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = useRef(null);
  const current = FORMATS[format];

  useEffect(() => {
    const video = videoRef.current;
    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([entry]) => {
              if (!entry.isIntersecting || entry.intersectionRatio < 0.15) {
                video.pause();
              }
            },
            { threshold: [0, 0.15] },
          )
        : null;
    observer?.observe(video);
    const pauseWhenHidden = () => {
      if (document.hidden) video.pause();
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", pauseWhenHidden);
      video.pause();
    };
  }, [format]);

  const changeFormat = (next) => {
    if (format === next) return;
    videoRef.current?.pause();
    setPlaying(false);
    setStarted(false);
    setMuted(true);
    setEnded(false);
    setError(false);
    setFormat(next);
  };

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video.paused) {
      video.pause();
      return;
    }
    setError(false);
    try {
      await video.play();
    } catch (playError) {
      if (playError.name !== "AbortError" && videoRef.current === video) {
        setError(true);
      }
    }
  };

  const toggleAudio = () => {
    const video = videoRef.current;
    video.muted = !video.muted;
    if (!video.muted && video.volume === 0) video.volume = 1;
    setMuted(video.muted);
  };

  const book = () => {
    videoRef.current?.pause();
    onBook?.();
  };

  return (
    <section
      id="presentacion"
      className="video-section"
      aria-labelledby="video-heading"
    >
      <div className="container video-container">
        <div className="video-intro">
          <div>
            <span className="eyebrow">
              <Flower2 size={15} /> CONOCE MATRONA GUÍA
            </span>
            <h2 id="video-heading">
              Un espacio que se siente <em>cercano.</em>
            </h2>
          </div>
          <p>
            Una pequeña presentación, hecha con la misma calidez con la que
            queremos acompañarte.
          </p>
        </div>

        <div className="video-layout">
          <div className="video-stage" data-format={format}>
            <div className="video-stage-top">
              <span className="video-film-label">
                <span aria-hidden="true" /> CONTIGO, EN CADA ETAPA
              </span>
              <div
                className="video-format-switch"
                role="group"
                aria-label="Elegir formato del video"
              >
                {Object.entries(FORMATS).map(([key, { label, Icon }]) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={format === key}
                    onClick={() => changeFormat(key)}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="video-media">
              <div className="video-window">
                <video
                  key={format}
                  ref={videoRef}
                  className="video-native"
                  src={current.src}
                  poster={current.poster}
                  controls
                  playsInline
                  preload="none"
                  muted={muted}
                  aria-label={`Presentación de Matrona Guía, formato ${current.label.toLowerCase()}`}
                  aria-describedby="video-transcript-content"
                  onPlay={() => {
                    setPlaying(true);
                    setStarted(true);
                    setEnded(false);
                  }}
                  onPause={() => setPlaying(false)}
                  onEnded={() => {
                    setPlaying(false);
                    setEnded(true);
                  }}
                  onVolumeChange={(event) =>
                    setMuted(event.currentTarget.muted)
                  }
                  onError={() => setError(true)}
                >
                  <track
                    kind="captions"
                    src="/videos/presentacion-es.vtt"
                    srcLang="es"
                    label="Español"
                  />
                  Tu navegador no puede reproducir este video. Puedes abrir el
                  archivo desde el enlace de abajo.
                </video>
                {!started && !error && (
                  <button
                    type="button"
                    className="video-play-overlay"
                    aria-label="Reproducir presentación"
                    onClick={togglePlayback}
                  >
                    <span>
                      <Play size={27} fill="currentColor" strokeWidth={1.3} />
                    </span>
                  </button>
                )}
              </div>
            </div>

            <div className="video-toolbar">
              <button
                type="button"
                className="video-play-button"
                onClick={togglePlayback}
                disabled={error}
                aria-label={playing ? "Pausar video" : "Reproducir video"}
              >
                {playing ? <Pause size={17} /> : <Play size={17} />}
                {playing
                  ? "Pausar"
                  : ended
                    ? "Volver a ver"
                    : started
                      ? "Continuar"
                      : "Dale play"}
              </button>
              <button
                type="button"
                className="video-sound-button"
                onClick={toggleAudio}
                aria-label={muted ? "Activar sonido" : "Silenciar video"}
                aria-pressed={!muted}
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                <span>{muted ? "Activar sonido" : "Con sonido"}</span>
              </button>
              <span className="video-duration">
                20 segundos para conocernos
              </span>
            </div>

            {error && (
              <p className="video-error" role="status">
                No pudimos reproducir el video aquí.{" "}
                <a href={current.src} target="_blank" rel="noopener noreferrer">
                  Abrir video <ExternalLink size={13} />
                </a>
              </p>
            )}

            <details className="video-transcript">
              <summary>
                Leer la presentación <Plus size={15} />
              </summary>
              <div id="video-transcript-content">
                <p>
                  Tu bienestar merece una guía cercana. Acompañamiento en salud
                  femenina, con respeto, calma y cercanía.
                </p>
                <p>
                  Aquí puedes ser tú. Tus preguntas siempre tienen un lugar:
                  escucha sin juicios, información clara y cuidado cercano. A tu
                  ritmo, con confianza.
                </p>
                <p>
                  Contigo, en cada etapa. Tu bienestar empieza por escucharte.
                  Demos el primer paso, juntas. Agenda por WhatsApp al +56 9
                  7589 8382. Instagram: @matronaguia.
                </p>
              </div>
            </details>
          </div>

          <aside
            className="video-aside"
            aria-label="Acompañamiento de Matrona Guía"
          >
            <span className="video-aside-icon">
              <Heart size={27} strokeWidth={1.3} />
            </span>
            <h3>
              Hay preguntas que merecen <em>tiempo y escucha.</em>
            </h3>
            <p>
              Este puede ser tu primer paso hacia un cuidado más consciente,
              cercano y a tu ritmo.
            </p>
            <div className="video-aside-principles">
              <span>
                <ShieldCheck size={17} /> Un espacio sin juicios
              </span>
              <span>
                <Flower2 size={17} /> Tu proceso, tu ritmo
              </span>
            </div>
            <button className="button" type="button" onClick={book}>
              <CalendarDays size={17} /> Agendar una consulta{" "}
              <ArrowUpRight size={17} />
            </button>
            <span className="video-aside-note">
              Coordinemos juntas por WhatsApp.
            </span>
            <Flower2
              className="video-note-flower"
              strokeWidth={0.7}
              aria-hidden="true"
            />
          </aside>
        </div>
      </div>
    </section>
  );
}
