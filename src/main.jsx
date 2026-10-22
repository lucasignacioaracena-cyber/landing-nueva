import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Baby,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  Flower2,
  Heart,
  Instagram,
  LockKeyhole,
  Menu,
  MessageCircle,
  Phone,
  Play,
  Plus,
  ShieldCheck,
  Sprout,
  X,
} from "lucide-react";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
import "@fontsource/dm-serif-display/latin-400.css";
import "@fontsource/dm-serif-display/latin-400-italic.css";
import "./styles.css";
import "./scroll.css";
import "./integration.css";
import useScrollExperience from "./useScrollExperience";
import VideoExperience from "./VideoExperience";

const PHONE = "56975898382";
const whatsapp = (
  message = "¡Hola, Matrona Guía! Me gustaría conocer más sobre la atención y solicitar una cita.",
) => `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
const services = [
  {
    id: "ginecologia",
    title: "Salud ginecológica",
    category: "Bienestar íntimo",
    Icon: Flower2,
    color: "rose",
    description:
      "Un espacio para conocer tu cuerpo, resolver dudas y cuidar tu salud íntima.",
    detail:
      "Conversemos sobre salud menstrual, cuidados íntimos y tus dudas ginecológicas. La consulta permite orientar tus próximos pasos y revisar qué atención necesitas.",
    points: [
      "Orientación sobre tu ciclo menstrual",
      "Dudas y cuidados de salud íntima",
      "Prevención y autocuidado",
    ],
  },
  {
    id: "anticoncepcion",
    title: "Anticoncepción",
    category: "Bienestar íntimo",
    Icon: Sprout,
    color: "sage",
    description:
      "Información clara para tomar decisiones que se sientan bien para ti.",
    detail:
      "Cada cuerpo y cada momento de vida son distintos. Recibe orientación sobre métodos anticonceptivos y conversa tus preferencias para evaluar las alternativas junto a una profesional.",
    points: [
      "Información sobre métodos disponibles",
      "Orientación según tus necesidades",
      "Espacio para resolver tus preguntas",
    ],
  },
  {
    id: "maternidad",
    title: "Embarazo y postparto",
    category: "Maternidad",
    Icon: Baby,
    color: "peach",
    description:
      "Acompañamiento cercano en una etapa llena de cambios y nuevas preguntas.",
    detail:
      "Un espacio de orientación para conversar sobre los cambios del embarazo y el postparto. Consulta por el acompañamiento disponible y cómo puede complementar tus controles de salud.",
    points: [
      "Orientación durante el embarazo",
      "Autocuidado en el postparto",
      "Dudas sobre esta nueva etapa",
    ],
  },
  {
    id: "bienestar",
    title: "Ciclo y bienestar",
    category: "Bienestar íntimo",
    Icon: Heart,
    color: "lilac",
    description:
      "Escucha y orientación para vivir cada etapa de tu salud con más confianza.",
    detail:
      "Tu bienestar cambia contigo. Conversemos sobre el ciclo, los cambios de etapa y los hábitos de autocuidado, con información que te ayude a entender mejor lo que estás viviendo.",
    points: [
      "Conocer y registrar tu ciclo",
      "Cambios a lo largo de la vida",
      "Educación en salud y bienestar",
    ],
  },
];

function Brand({ footer = false }) {
  return (
    <a
      href="#inicio"
      className={`brand ${footer ? "brand-footer" : ""}`}
      aria-label="Matrona Guía, inicio"
    >
      <span className="brand-flower" aria-hidden="true">
        <Flower2 size={37} strokeWidth={1.25} />
      </span>
      <span>
        matrona
        <span className="brand-guia">
          guía<span className="brand-dot">.</span>
        </span>
      </span>
    </a>
  );
}

function TikTok({ size = 21, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14 3v12.5a5 5 0 1 1-4-4.9v3.1a2 2 0 1 0 1 1.8V3h3c.4 3.2 2.1 4.8 5 5v3c-2-.1-3.7-.9-5-2.2" />
    </svg>
  );
}

function Burst({ className = "" }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      viewBox="0 0 80 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="7"
      strokeLinecap="round"
    >
      <path d="M40 8v64M8 40h64M17 17l46 46M17 63l46-46" />
    </svg>
  );
}

function App() {
  const { activeSection, pastHero, scrolled } = useScrollExperience();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [booking, setBooking] = useState(null);
  const [detail, setDetail] = useState(null);
  const [filter, setFilter] = useState("Todos");
  const [openFaq, setOpenFaq] = useState(0);
  useEffect(() => {
    if (booking || detail) {
      document.querySelectorAll("video").forEach((video) => video.pause());
    }
  }, [booking, detail]);
  const openBooking = (service = "") => {
    setDetail(null);
    setMobileMenu(false);
    setBooking({ service });
  };
  const faqs = [
    [
      "¿Cómo puedo agendar una cita?",
      "Haz clic en “Agendar mi cita”, elige el motivo de consulta y tu fecha y horario preferidos. Al finalizar se abrirá WhatsApp con tu solicitud preparada. Envía el mensaje para coordinar y confirmar tu atención.",
    ],
    [
      "¿La atención es presencial u online?",
      "Puedes consultar la modalidad y el lugar de atención disponibles directamente por WhatsApp. Estos detalles se coordinan antes de confirmar tu cita.",
    ],
    [
      "¿Necesito tener una duda específica para consultar?",
      "Puedes solicitar orientación aunque todavía no sepas cómo explicar lo que te pasa. Cuéntame en términos generales qué necesitas y coordinaremos el siguiente paso.",
    ],
    [
      "¿Dónde puedo consultar el valor de la atención?",
      "Los valores y los medios de pago se consultan por WhatsApp antes de confirmar. Así puedes conocer los detalles de la atención y decidir con tranquilidad.",
    ],
    [
      "¿Puedo cambiar o cancelar mi cita?",
      "Sí, escribe al mismo WhatsApp con el que coordinaste tu atención para solicitar un cambio o una cancelación. Avísanos con anticipación para revisar las alternativas disponibles.",
    ],
  ];

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <header className="header">
        <div className="container header-inner">
          <Brand />
          <nav
            className={`nav ${mobileMenu ? "nav-open" : ""}`}
            aria-label="Navegación principal"
          >
            <a
              href="#presentacion"
              aria-current={
                activeSection === "presentacion" ? "location" : undefined
              }
              onClick={() => setMobileMenu(false)}
            >
              Presentación
            </a>
            <a
              href="#servicios"
              aria-current={
                activeSection === "servicios" ? "location" : undefined
              }
              onClick={() => setMobileMenu(false)}
            >
              Cómo te acompaño
            </a>
            <a
              href="#enfoque"
              aria-current={
                activeSection === "enfoque" ? "location" : undefined
              }
              onClick={() => setMobileMenu(false)}
            >
              Mi enfoque
            </a>
            <a
              href="#preguntas"
              aria-current={
                activeSection === "preguntas" ? "location" : undefined
              }
              onClick={() => setMobileMenu(false)}
            >
              Preguntas frecuentes
            </a>
          </nav>
          <div className="header-actions">
            <button
              className="button button-small"
              onClick={() => openBooking()}
            >
              <CalendarDays size={17} /> Agendar una cita{" "}
              <ArrowUpRight size={16} />
            </button>
            <button
              className="menu-toggle icon-button"
              aria-label={mobileMenu ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileMenu}
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <div className="scroll-progress" aria-hidden="true">
          <span />
        </div>
      </header>

      <main id="contenido">
        <section id="inicio" className="hero container" tabIndex={-1}>
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow">
              <Burst className="tiny-flower" /> UN ESPACIO SEGURO PARA TI
            </span>
            <h1>
              Tu bienestar
              <br />
              merece una
              <br />
              <em>guía cercana.</em>
              <Burst className="heading-star" />
            </h1>
            <p className="hero-description">
              Acompañamiento en salud femenina, con la calidez que necesitas y
              la información que mereces. Aquí, tus preguntas siempre tienen un
              lugar.
            </p>
            <div className="hero-buttons">
              <button className="button" onClick={() => openBooking()}>
                Agendar mi cita <ArrowUpRight size={19} />
              </button>
              <a className="text-link hero-video-link" href="#presentacion">
                <span className="inline-play">
                  <Play size={13} fill="currentColor" />
                </span>
                Ver presentación <ArrowRight size={17} />
              </a>
            </div>
            <div className="hero-promises">
              <span>
                <ShieldCheck size={17} /> Un espacio de confianza
              </span>
              <span className="promise-dot" aria-hidden="true" />
              <span>
                <Heart size={16} /> Cuidado sin juicios
              </span>
            </div>
            <a className="scroll-invitation" href="#presentacion">
              <span className="scroll-invitation-icon">
                <ArrowDown size={15} />
              </span>{" "}
              Descubre tu espacio{" "}
              <span className="scroll-invitation-line" aria-hidden="true" />
            </a>
          </div>
          <div className="hero-visual">
            <div className="photo-outline" aria-hidden="true" />
            <div className="hero-photo-wrap">
              <img
                src="/images/maternity.webp"
                width="880"
                height="1100"
                alt="Imagen ilustrativa de una mujer embarazada sosteniendo su vientre en un ambiente tranquilo"
                className="hero-photo"
                fetchPriority="high"
              />
            </div>
            <div className="photo-sticker">
              <Flower2 size={29} strokeWidth={1.1} />
              <span>
                Contigo, en
                <br />
                <strong>cada etapa.</strong>
              </span>
            </div>
            <Burst className="visual-flower" />
            <div className="image-caption">
              <span /> ESCUCHAR · ACOMPAÑAR · CUIDAR
            </div>
          </div>
        </section>

        <div className="values-strip">
          <div className="container values-inner">
            <span>Tu cuerpo, tus decisiones.</span>
            <Flower2 size={22} strokeWidth={1.3} />
            <span>Información que da tranquilidad.</span>
            <Flower2 size={22} strokeWidth={1.3} />
            <span>Un cuidado tan único como tú.</span>
          </div>
        </div>

        <VideoExperience onBook={() => openBooking()} />

        <section id="servicios" className="section services-section container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">CUIDADO QUE CRECE CONTIGO</span>
              <h2>
                Cada etapa, <em>su guía.</em>
              </h2>
            </div>
            <p>
              Porque no hay una sola forma de vivir tu salud.
              <br className="desktop-break" /> Encontremos juntas el
              acompañamiento para ti.
            </p>
          </div>
          <div
            className="service-filters"
            role="group"
            aria-label="Filtrar servicios"
          >
            {["Todos", "Bienestar íntimo", "Maternidad"].map((item) => (
              <button
                key={item}
                className={filter === item ? "filter active" : "filter"}
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="service-grid">
            {services
              .filter((s) => filter === "Todos" || s.category === filter)
              .map(({ Icon, ...service }) => (
                <button
                  className={`service-card ${service.color}`}
                  key={service.id}
                  onClick={() => setDetail({ Icon, ...service })}
                >
                  <span className="service-icon">
                    <Icon size={28} strokeWidth={1.4} />
                  </span>
                  <span className="service-title">{service.title}</span>
                  <span className="service-description">
                    {service.description}
                  </span>
                  <span className="service-link">
                    Conocer más <ArrowUpRight size={18} />
                  </span>
                </button>
              ))}
          </div>
          <p className="service-help">
            <MessageCircle size={17} /> ¿No sabes qué consulta necesitas?{" "}
            <a
              href={whatsapp(
                "¡Hola, Matrona Guía! Me gustaría orientación para saber qué consulta necesito.",
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Conversemos por WhatsApp <ArrowUpRight size={14} />
            </a>
          </p>
        </section>

        <section id="enfoque" className="approach-section">
          <div className="container approach-grid">
            <div className="approach-art">
              <div className="art-circle">
                <Flower2 strokeWidth={0.65} className="large-flower" />
                <span className="art-spark art-spark-one">✦</span>
                <span className="art-spark art-spark-two">✦</span>
                <span className="art-caption">SALUD CON CALIDEZ</span>
              </div>
              <div className="art-note">
                <Heart size={17} /> Aquí puedes ser tú.
              </div>
            </div>
            <div className="approach-copy">
              <span className="eyebrow">
                MÁS QUE UNA CONSULTA, UN ENCUENTRO
              </span>
              <h2>
                Escucharte es el
                <br />
                primer paso para <em>cuidarte.</em>
              </h2>
              <p>
                A veces necesitas una respuesta. Otras, un espacio donde poder
                preguntar sin vergüenza. Matrona Guía nace de esa idea:
                acompañarte con cercanía, respeto e información clara.
              </p>
              <p>
                Tu historia importa. Tu ritmo también. Construyamos juntas una
                forma de cuidar tu salud que se sienta tuya.
              </p>
              <a
                className="profile-signature"
                href="https://www.instagram.com/matronaguia/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver el perfil de Matrona Guía en Instagram"
              >
                <span className="profile-avatar" aria-hidden="true">
                  <Flower2 size={27} strokeWidth={1.25} />
                </span>
                <span className="profile-name">
                  <strong>Matrona Guía</strong>
                  <span>@matronaguia</span>
                </span>
                <Instagram size={19} strokeWidth={1.5} />
                <ArrowUpRight size={16} />
              </a>
              <div className="approach-principles">
                <span>
                  <Check size={16} /> Escucha con empatía
                </span>
                <span>
                  <Check size={16} /> Decisiones informadas
                </span>
                <span>
                  <Check size={16} /> Respeto por tu proceso
                </span>
              </div>
              <a
                className="text-link"
                href={whatsapp()}
                target="_blank"
                rel="noopener noreferrer"
              >
                Me gustaría conversar <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </section>

        <section
          id="como-agendar"
          className="section container booking-section"
        >
          <div className="center-heading">
            <span className="eyebrow">DAR EL PRIMER PASO PUEDE SER SIMPLE</span>
            <h2>
              Tu próxima cita, <em>más cerca.</em>
            </h2>
            <p>Unos pequeños pasos para empezar a cuidarte.</p>
          </div>
          <div className="steps-grid">
            {[
              {
                n: "01",
                Icon: Heart,
                title: "Cuéntame qué necesitas",
                text: "Elige el motivo de tu consulta. Si tienes dudas, también podemos orientarte.",
              },
              {
                n: "02",
                Icon: CalendarDays,
                title: "Elige tu momento",
                text: "Selecciona una fecha y un horario que te acomoden para solicitar tu atención.",
              },
              {
                n: "03",
                Icon: MessageCircle,
                title: "Coordinemos por WhatsApp",
                text: "Envía tu solicitud y confirma la disponibilidad y los detalles directamente.",
              },
            ].map(({ n, Icon, title, text }) => (
              <div
                className="step"
                key={n}
                style={{ "--step-index": Number(n) - 1 }}
              >
                <div className="step-top">
                  <span className="step-number">{n}</span>
                  <Icon size={23} strokeWidth={1.4} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <button className="button" onClick={() => openBooking()}>
            Quiero agendar mi cita <ArrowUpRight size={18} />
          </button>
          <span className="booking-footnote">
            Tu solicitud se confirma personalmente por WhatsApp.
          </span>
        </section>

        <section className="social-section">
          <div className="container social-grid">
            <div>
              <span className="eyebrow">SIGAMOS CONECTADAS</span>
              <h2>
                Un poquito de guía,
                <br />
                <em>todos los días.</em>
              </h2>
              <p>
                Conversemos sobre salud, autocuidado y esas
                <br className="desktop-break" /> preguntas que muchas veces nos
                guardamos.
              </p>
            </div>
            <div className="social-links">
              <a
                className="social-card"
                href="https://www.instagram.com/matronaguia/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="social-icon">
                  <Instagram size={25} strokeWidth={1.5} />
                </span>
                <span>
                  <span className="social-label">ENCUÉNTRAME EN INSTAGRAM</span>
                  <strong>@matronaguia</strong>
                </span>
                <ArrowUpRight size={21} />
              </a>
              <a
                className="social-card"
                href="https://www.tiktok.com/@matronaguia"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="social-icon tiktok-icon">
                  <TikTok size={26} />
                </span>
                <span>
                  <span className="social-label">TAMBIÉN EN TIKTOK</span>
                  <strong>@matronaguia</strong>
                </span>
                <ArrowUpRight size={21} />
              </a>
            </div>
          </div>
        </section>

        <section id="preguntas" className="section container faq-section">
          <div className="faq-intro">
            <span className="eyebrow">CONVERSEMOS SIN DUDAS</span>
            <h2>
              Quizás te estás
              <br />
              <em>preguntando…</em>
            </h2>
            <p>
              Y si tu pregunta no está aquí,
              <br />
              puedes escribirme con confianza.
            </p>
            <a
              className="text-link"
              href={whatsapp()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Hacer otra pregunta <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer], i) => (
              <div
                className={`faq-item ${openFaq === i ? "faq-open" : ""}`}
                key={question}
              >
                <h3>
                  <button
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {question}
                    <Plus size={19} />
                  </button>
                </h3>
                <div id={`faq-${i}`} hidden={openFaq !== i}>
                  <p>{answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="container final-cta">
          <Flower2
            className="cta-flower"
            strokeWidth={0.7}
            aria-hidden="true"
          />
          <div>
            <span className="eyebrow">ESTE ESPACIO TAMBIÉN ES TUYO</span>
            <h2>
              Empecemos por <em>ti.</em>
            </h2>
            <p>Tu bienestar merece tiempo, escucha y una guía cercana.</p>
          </div>
          <button className="button button-white" onClick={() => openBooking()}>
            Agendar mi primera cita <ArrowUpRight size={19} />
          </button>
        </section>
      </main>

      <footer className="footer container">
        <div className="footer-top">
          <div>
            <Brand footer />
            <p>Contigo, en cada etapa de tu bienestar.</p>
          </div>
          <div className="footer-contact">
            <span>¿CONVERSEMOS?</span>
            <a href={`tel:+${PHONE}`}>
              <Phone size={16} /> +56 9 7589 8382
            </a>
          </div>
          <div className="footer-socials">
            <a
              href="https://www.instagram.com/matronaguia/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Matrona Guía"
            >
              <Instagram size={21} />
            </a>
            <a
              href="https://www.tiktok.com/@matronaguia"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok de Matrona Guía"
            >
              <TikTok size={21} />
            </a>
            <a
              href={whatsapp()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp de Matrona Guía"
            >
              <MessageCircle size={21} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Matrona Guía. Hecho con cuidado.
          </span>
          <span>
            La información del sitio no reemplaza una evaluación profesional.
          </span>
        </div>
      </footer>

      <a
        className="whatsapp-float"
        href={whatsapp()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversemos por WhatsApp"
      >
        <MessageCircle size={25} />
        <span>¿Conversamos?</span>
      </a>

      {scrolled && (
        <button
          className="back-to-top"
          aria-label="Volver al inicio"
          onClick={() => {
            document.getElementById("inicio").scrollIntoView({
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "instant"
                : "smooth",
            });
            document.getElementById("inicio").focus({ preventScroll: true });
          }}
        >
          <ArrowUp size={19} />
        </button>
      )}
      {pastHero && (
        <button
          className="mobile-booking-bar button"
          onClick={() => openBooking()}
        >
          <CalendarDays size={18} /> Un momento para ti{" "}
          <span>
            Agendar <ArrowUpRight size={16} />
          </span>
        </button>
      )}

      {detail && (
        <Modal
          onClose={() => setDetail(null)}
          title={detail.title}
          className="service-modal"
        >
          <span className={`detail-icon ${detail.color}`}>
            <detail.Icon size={33} strokeWidth={1.3} />
          </span>
          <span className="eyebrow">UN ESPACIO PARA TU BIENESTAR</span>
          <h2>{detail.title}</h2>
          <p className="modal-description">{detail.detail}</p>
          <ul className="detail-points">
            {detail.points.map((point) => (
              <li key={point}>
                <CircleCheck size={18} />
                {point}
              </li>
            ))}
          </ul>
          <button
            className="button full-width"
            onClick={() => openBooking(detail.id)}
          >
            Solicitar una consulta <ArrowUpRight size={18} />
          </button>
          <p className="modal-note">
            Consulta por el alcance y la disponibilidad de la atención por
            WhatsApp.
          </p>
        </Modal>
      )}
      {booking && (
        <Booking
          initialService={booking.service}
          onClose={() => setBooking(null)}
        />
      )}
    </>
  );
}

function Modal({ onClose, title, children, className = "" }) {
  const modalRef = useRef(null);
  const previouslyFocused = useRef(document.activeElement);
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modalRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const focusable = [
          ...modalRef.current.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
          ),
        ].filter((el) => el.getClientRects().length);
        const first = focusable[0];
        const last = focusable.at(-1);
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === modalRef.current)
        ) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKey);
      previouslyFocused.current?.focus();
    };
  }, [onClose]);
  return (
    <div
      className="modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`modal ${className}`}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <button
          className="modal-close icon-button"
          onClick={onClose}
          aria-label="Cerrar ventana"
        >
          <X size={22} />
        </button>
        {children}
      </div>
    </div>
  );
}

const getToday = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  return new Date(
    Number(parts.find((p) => p.type === "year").value),
    Number(parts.find((p) => p.type === "month").value) - 1,
    Number(parts.find((p) => p.type === "day").value),
  );
};
const dateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const formatDate = (date) =>
  date.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function Booking({ initialService, onClose }) {
  const [step, setStep] = useState(1);
  const [service, setService] = useState(initialService || "");
  const [selectedDate, setSelectedDate] = useState(null);
  const [period, setPeriod] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const today = getToday();
  const [month, setMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const formRef = useRef(null);
  const firstDay =
    (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
  const daysCount = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const selectedService =
    services.find((s) => s.id === service)?.title || "Orientación general";
  const canContinue = step === 1 ? !!service : !!selectedDate && !!period;
  const changeMonth = (delta) =>
    setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));
  const sendMessage = `¡Hola, Matrona Guía! Soy ${name.trim()}. Me gustaría solicitar una cita.\n\nMotivo: ${selectedService}\nFecha preferida: ${selectedDate ? formatDate(selectedDate) : ""}\nHorario preferido: ${period} (hora de Chile continental)\n\nQuedo pendiente de confirmar disponibilidad, modalidad y valor de la atención. ¡Gracias!`;

  return (
    <Modal
      onClose={onClose}
      title="Solicitar una cita"
      className="booking-modal"
    >
      <div className="booking-modal-header">
        <span className="eyebrow">
          <Flower2 size={16} /> UN MOMENTO PARA TI
        </span>
        <h2>
          Agendemos <em>tu cita.</em>
        </h2>
        <p>El primer paso para acompañarte.</p>
      </div>
      <ol
        className="booking-progress"
        aria-label="Pasos para solicitar una cita"
      >
        {["Tu consulta", "Tu momento", "Confirmar"].map((label, i) => (
          <li
            key={label}
            className={step >= i + 1 ? "current" : ""}
            aria-current={step === i + 1 ? "step" : undefined}
          >
            <span>{step > i + 1 ? <Check size={13} /> : i + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      <div className="booking-panel" aria-live="polite">
        {step === 1 && (
          <>
            <h3>¿Cómo puedo acompañarte?</h3>
            <p className="field-hint">
              Elige el motivo que más se acerque a lo que necesitas.
            </p>
            <div className="booking-services">
              {[
                ...services,
                {
                  id: "orientacion",
                  title: "Necesito orientación",
                  Icon: MessageCircle,
                },
              ].map(({ id, title, Icon }) => (
                <button
                  className={`booking-service ${service === id ? "selected" : ""}`}
                  key={id}
                  aria-pressed={service === id}
                  onClick={() => setService(id)}
                >
                  <Icon size={21} strokeWidth={1.5} />
                  <span>{title}</span>
                  <span className="radio-circle">
                    {service === id && <span />}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h3>¿Cuándo te acomoda?</h3>
            <p className="field-hint">
              Elige una preferencia. La disponibilidad se confirma por WhatsApp.
            </p>
            <div className="calendar">
              <div className="calendar-heading">
                <button
                  className="icon-button"
                  onClick={() => changeMonth(-1)}
                  disabled={
                    month.getFullYear() === today.getFullYear() &&
                    month.getMonth() === today.getMonth()
                  }
                  aria-label="Mes anterior"
                >
                  <ChevronLeft size={20} />
                </button>
                <strong>
                  {month.toLocaleDateString("es-CL", {
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
                <button
                  className="icon-button"
                  onClick={() => changeMonth(1)}
                  aria-label="Mes siguiente"
                  disabled={
                    month.getTime() >=
                    new Date(
                      today.getFullYear(),
                      today.getMonth() + 6,
                      1,
                    ).getTime()
                  }
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="calendar-grid">
                {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => (
                  <span className="weekday" key={i}>
                    {day}
                  </span>
                ))}
                {Array.from({ length: firstDay }, (_, i) => (
                  <span key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysCount }, (_, i) => {
                  const date = new Date(
                    month.getFullYear(),
                    month.getMonth(),
                    i + 1,
                  );
                  const selected =
                    selectedDate && dateKey(date) === dateKey(selectedDate);
                  return (
                    <button
                      key={i}
                      className={`calendar-day ${selected ? "selected" : ""} ${dateKey(date) === dateKey(today) ? "today" : ""}`}
                      disabled={date < today}
                      aria-label={formatDate(date)}
                      aria-pressed={Boolean(selected)}
                      onClick={() => setSelectedDate(date)}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
            <label className="field-label">
              Horario preferido <span>· Hora de Chile continental</span>
            </label>
            <div className="time-options">
              {["Mañana", "Tarde", "A coordinar"].map((time) => (
                <button
                  key={time}
                  aria-pressed={period === time}
                  className={period === time ? "selected" : ""}
                  onClick={() => setPeriod(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h3>Ya casi estamos.</h3>
            <p className="field-hint">
              Revisa tu solicitud y continuemos por WhatsApp.
            </p>
            <div className="booking-summary">
              <div>
                <Heart size={18} />
                <span>
                  Consulta<strong>{selectedService}</strong>
                </span>
              </div>
              <div>
                <CalendarDays size={18} />
                <span>
                  Fecha preferida
                  <strong>{selectedDate && formatDate(selectedDate)}</strong>
                </span>
              </div>
              <div>
                <Clock3 size={18} />
                <span>
                  Horario preferido
                  <strong>{period} · Hora de Chile continental</strong>
                </span>
              </div>
            </div>
            <form
              id="booking-form"
              ref={formRef}
              action="https://wa.me/56975898382"
              method="get"
              target="_blank"
              rel="noopener noreferrer"
              onSubmit={(e) => {
                if (!name.trim()) {
                  e.preventDefault();
                  formRef.current
                    .querySelector("#booking-name")
                    .setCustomValidity("Escribe tu nombre para continuar.");
                  formRef.current.reportValidity();
                }
              }}
            >
              <input type="hidden" name="text" value={sendMessage} />
              <label className="field-label" htmlFor="booking-name">
                ¿Cómo te llamas?
              </label>
              <input
                id="booking-name"
                autoComplete="given-name"
                type="text"
                required
                maxLength={60}
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => {
                  e.target.setCustomValidity("");
                  setName(e.target.value);
                }}
              />
              <label className="consent-label">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  Entiendo que esta es una solicitud y que mi cita queda
                  confirmada al coordinar por WhatsApp.
                </span>
              </label>
            </form>
            <div className="privacy-note">
              <LockKeyhole size={14} />
              <span>
                Los datos se usan para preparar tu mensaje y no se guardan en
                este sitio. Evita incluir información médica sensible.
              </span>
            </div>
          </>
        )}
      </div>
      <div className="booking-modal-footer">
        {step > 1 && (
          <button className="back-button" onClick={() => setStep(step - 1)}>
            <ChevronLeft size={17} /> Atrás
          </button>
        )}
        {step < 3 ? (
          <button
            key="continue"
            type="button"
            className="button booking-next"
            disabled={!canContinue}
            onClick={(event) => {
              event.preventDefault();
              setStep(step + 1);
            }}
          >
            Continuar <ArrowRight size={18} />
          </button>
        ) : (
          <button
            key="submit"
            type="submit"
            form="booking-form"
            className="button booking-next"
          >
            <MessageCircle size={18} /> Enviar por WhatsApp{" "}
            <ArrowUpRight size={17} />
          </button>
        )}
      </div>
      <p className="booking-disclaimer">
        Sin pago online. Coordinación directa y personal.
      </p>
    </Modal>
  );
}

createRoot(document.getElementById("root")).render(<App />);
