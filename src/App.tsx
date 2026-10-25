import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  Mail,
  Flower2,
  Globe2,
  GraduationCap,
  Heart,
  Info,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import Booking, { Modal } from "./Booking";
import {
  catalogCategories as categories,
  catalogServices,
  bookingServices,
  priceGroups,
  formatPriceCLP,
  profile,
  services,
  whatsapp,
} from "./content";
import { photos, serviceArtwork } from "./photos";
import HeroSection from "./HeroSection";
import Education from "./Education";
import { PatientExperiences, ContactForm } from "./CommunityForms";

type Service = (typeof catalogServices)[number];
const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const faqs = [
  [
    "¿Cómo agendo y confirmo mi reserva?",
    "Elige tu atención y envía la solicitud por WhatsApp para coordinar disponibilidad. Las atenciones online se pagan por su valor completo. Para las presenciales se solicita un abono de $10.000 por transferencia para reservar tu hora. Los datos de pago se coordinan directamente con Camila.",
  ],
  [
    "¿Dónde consulto los valores y qué incluyen?",
    "En la sección Valores encontrarás las atenciones online, presenciales y los procedimientos. La toma de PAP de $20.000 incluye kit y entrega de resultados. Las inserciones no incluyen el dispositivo y el inyectable de $15.000 corresponde solo a su administración.",
  ],
  [
    "¿Cómo es la atención online?",
    "Camila atiende por videollamada y chat para todo Chile. Las consultas tienen una duración aproximada de 45 minutos. Coordina el formato y el horario por WhatsApp antes de confirmar.",
  ],
  [
    "¿Qué puedo llevar a la consulta?",
    "Puedes preparar tus preguntas y llevar tus exámenes previos si los tienes. Para un procedimiento, consulta antes con Camila qué necesitas llevar y cómo prepararte.",
  ],
  [
    "¿Cómo cancelo o reagendo una atención?",
    "Escribe al mismo WhatsApp con un mínimo de 2 días hábiles de anticipación para coordinar una cancelación o un cambio de hora.",
  ],
  [
    "¿Desde qué edad atiende Camila?",
    "Camila atiende desde los 10 años, con un acompañamiento acorde a cada etapa. Puedes consultar los detalles de la atención al coordinar tu hora.",
  ],
  [
    "¿Dónde y cuándo es la atención presencial?",
    "La consulta está en Carmen Covarrubias 32, Ñuñoa, Santiago. La atención presencial es los viernes de 10:00 a 16:00 horas y tiene una duración aproximada de una hora. La disponibilidad se confirma personalmente.",
  ],
];

function Portrait({
  index = 0,
  className = "",
  loading = "lazy",
}: {
  index?: number;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  const photo = photos[index % photos.length];
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [photo.src]);
  if (photo.src && !failed)
    return (
      <img
        className={className}
        src={photo.src}
        alt={photo.alt}
        style={{ objectPosition: photo.position }}
        loading={loading}
        onError={() => setFailed(true)}
      />
    );
  return (
    <div className={`cg-portrait-fallback ${className}`} aria-hidden="true">
      <Flower2 strokeWidth={0.5} />
      <span>
        cr<span>.</span>
      </span>
      <small>MATRONA GUÍA</small>
    </div>
  );
}

function Brand() {
  return (
    <a className="cg-brand" href="#inicio" aria-label="Matrona Guía, inicio">
      <span className="cg-brand-icon">
        <Flower2 size={29} strokeWidth={1.3} />
      </span>
      <span>
        matrona <em>guía.</em>
      </span>
    </a>
  );
}

export default function App() {
  const [menu, setMenu] = useState(false);
  const [category, setCategory] = useState("todos");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<Service | null>(null);
  const [booking, setBooking] = useState<{ service: string } | null>(null);
  const [portrait, setPortrait] = useState(0);
  const [faq, setFaq] = useState<number | null>(null);
  const [scrollTop, setScrollTop] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [priceMode, setPriceMode] = useState("presencial");
  const selectedPriceGroup =
    priceGroups.find((group) => group.id === priceMode) || priceGroups[0];
  const mapUrl =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Carmen Covarrubias 32, Ñuñoa, Santiago, Chile");
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const searchAliases: Record<string, string> = {
    "consultas-ginecologicas": "PAP Papanicolaou control ginecológico",
    "metodos-larga-duracion":
      "Implanon Levoplant DIU cobre Silverflex implante",
    inyecciones: "inyectable IM vacuna",
    "revision-examenes": "orden exámenes recetas",
  };
  const filtered = catalogServices.filter(
    (s) =>
      (category === "todos" || s.category === category) &&
      normalize(
        `${s.title} ${s.description} ${searchAliases[s.id] || ""}`,
      ).includes(normalize(query.trim())),
  );

  const closeBooking = useCallback(() => setBooking(null), []);
  const closeDetail = useCallback(() => setDetail(null), []);
  const openBooking = useCallback(
    (service = "") => {
      if (detail || menu) {
        setDetail(null);
        setMenu(false);
        requestAnimationFrame(() => {
          const trigger = service
            ? document.querySelector<HTMLButtonElement>(
                `[data-book="${service}"]`,
              )
            : menuButtonRef.current;
          trigger?.focus({ preventScroll: true });
          setBooking({ service });
        });
      } else setBooking({ service });
    },
    [detail, menu],
  );

  useEffect(() => {
    const desktop = matchMedia("(min-width: 981px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenu(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrollTop(window.scrollY > 650);
      const root = document.documentElement;
      root.style.setProperty(
        "--cg-progress",
        String(
          Math.min(1, scrollY / Math.max(1, root.scrollHeight - innerHeight)),
        ),
      );
      const hero = document.getElementById("inicio");
      setPastHero(Boolean(hero && hero.getBoundingClientRect().bottom <= 0));
      const progress = Math.min(
        1,
        Math.max(0, -(hero?.getBoundingClientRect().top || 0) / innerHeight),
      );
      root.style.setProperty(
        "--cg-photo-shift",
        motion.matches ? "0px" : `${progress * 12}px`,
      );
      root.style.setProperty(
        "--cg-seal-turn",
        motion.matches ? "0deg" : `${-12 + progress * 32}deg`,
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    motion.addEventListener("change", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
    };
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!menu) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
      if (event.key !== "Tab") return;
      const controls = [
        menuButtonRef.current,
        ...Array.from(
          menuRef.current?.querySelectorAll<HTMLElement>("a[href],button") ||
            [],
        ),
      ].filter((n): n is HTMLElement => Boolean(n));
      const first = controls[0],
        last = controls.at(-1);
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === menuRef.current)
      ) {
        event.preventDefault();
        last?.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          document.activeElement === menuRef.current)
      ) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key);
      menuButtonRef.current?.focus();
    };
  }, [menu]);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const nodes = document.querySelectorAll<HTMLElement>(".cg-reveal");
    let observer: IntersectionObserver | undefined;
    const setup = () => {
      observer?.disconnect();
      if (preference.matches) {
        nodes.forEach((n) => n.classList.add("cg-visible"));
        return;
      }
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("cg-visible");
              observer?.unobserve(entry.target);
            }
          }),
        { threshold: 0.06 },
      );
      nodes.forEach((n) => observer?.observe(n));
    };
    setup();
    preference.addEventListener("change", setup);
    return () => {
      observer?.disconnect();
      preference.removeEventListener("change", setup);
    };
  }, []);

  return (
    <>
      <div className="cg-site">
        <a className="skip-link" href="#servicios">
          Saltar a los servicios
        </a>
        <main inert={menu ? true : undefined}>
          <HeroSection
            onBook={() => openBooking()}
            suspended={Boolean(booking || detail)}
          />

          <section
            className="cg-highlights cg-container"
            aria-label="Modalidades y atención"
          >
            <div>
              <MapPin size={21} strokeWidth={1.3} />
              <span>
                <strong>Presencial en Ñuñoa</strong>
                <small>Santiago, Chile</small>
              </span>
            </div>
            <div>
              <Globe2 size={21} strokeWidth={1.3} />
              <span>
                <strong>Online para todo Chile</strong>
                <small>Coordinación directa por WhatsApp</small>
              </span>
            </div>
            <div>
              <Heart size={21} strokeWidth={1.3} />
              <span>
                <strong>Tu salud, a tu ritmo</strong>
                <small>Atención con respeto y cercanía</small>
              </span>
            </div>
          </section>

          <section
            className="cg-services cg-container"
            id="servicios"
            aria-labelledby="cg-services-heading"
          >
            <div className="cg-section-heading cg-reveal">
              <div>
                <span className="cg-eyebrow">ELIGE CÓMO CUIDARTE</span>
                <h2 id="cg-services-heading">
                  Un espacio para
                  <br />
                  <em>cada necesidad.</em>
                </h2>
              </div>
              <button
                className={`cg-search-toggle ${searchOpen ? "cg-search-active" : ""}`}
                aria-label={
                  searchOpen
                    ? "Cerrar búsqueda de servicios"
                    : "Buscar un servicio"
                }
                aria-expanded={searchOpen}
                aria-controls="cg-search-panel"
                onClick={() => {
                  setSearchOpen((v) => !v);
                  setQuery("");
                }}
              >
                {searchOpen ? <X size={22} /> : <Search size={24} />}
              </button>
            </div>
            <div className="cg-service-controls">
              <div
                className="cg-filter-pills"
                role="group"
                aria-label="Filtrar servicios por categoría"
              >
                {categories.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    className={category === id ? "cg-filter-active" : ""}
                    aria-pressed={category === id}
                    onClick={() => setCategory(id)}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                    {label}
                  </button>
                ))}
              </div>
              <span className="cg-price-unit">
                ACOMPAÑAMIENTO EN CADA ETAPA
              </span>
            </div>
            <div
              id="cg-search-panel"
              hidden={!searchOpen}
              className="cg-search-panel"
            >
              <label htmlFor="cg-search">¿Qué atención estás buscando?</label>
              <div>
                <Search size={19} />
                <input
                  id="cg-search"
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Por ejemplo: PAP, DIU o implante"
                  autoComplete="off"
                />
              </div>
            </div>
            <span className="sr-only" role="status">
              {filtered.length}{" "}
              {filtered.length === 1
                ? "servicio encontrado"
                : "servicios encontrados"}
            </span>
            <div className="cg-service-grid cg-catalog-grid">
              {filtered.map((service) => (
                <article
                  className={`cg-service-card cg-catalog-card cg-service-${service.category}`}
                  key={service.id}
                  aria-labelledby={`service-${service.id}`}
                >
                  <div className="cg-service-art" aria-hidden="true">
                    <img
                      className="cg-service-photo"
                      src={
                        serviceArtwork[service.category] ||
                        serviceArtwork.default
                      }
                      alt=""
                      loading="lazy"
                    />
                  </div>
                  <div className="cg-service-overlay" />
                  <div className="cg-service-top">
                    <span className="cg-catalog-icon">
                      <service.Icon size={23} strokeWidth={1.3} />
                    </span>
                    <button
                      className="cg-service-info"
                      onClick={() => setDetail(service)}
                      aria-label={`Ver detalles de ${service.title}`}
                    >
                      <Info size={21} />
                    </button>
                  </div>
                  <div className="cg-service-main">
                    <h3 id={`service-${service.id}`}>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                  <div className="cg-service-bottom">
                    <a
                      className="cg-card-book"
                      href={whatsapp(
                        `¡Hola, Camila! Quisiera consultar y agendar una atención de ${service.title}.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Consultar y agendar ${service.title}`}
                    >
                      <MessageCircle size={17} />
                      Consultar / Agendar
                      <ArrowUpRight size={17} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="cg-no-results">
                <Search size={30} />
                <h3>Busquemos tu atención</h3>
                <p>No hay servicios que coincidan con esta búsqueda.</p>
                <button
                  className="cg-button"
                  onClick={() => {
                    setQuery("");
                    setCategory("todos");
                  }}
                >
                  Ver todos los servicios <ArrowRight size={17} />
                </button>
              </div>
            )}
            <div className="cg-online-strip">
              <span className="cg-online-icon">
                <Globe2 size={26} strokeWidth={1.3} />
              </span>
              <div>
                <h3>¿Buscas atención online?</h3>
                <p>
                  Camila también atiende online para todo Chile. Conversemos
                  sobre lo que necesitas.
                </p>
              </div>
              <a
                href={whatsapp(
                  "¡Hola, Camila! Me gustaría consultar por la atención online, su valor y cómo agendar.",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Consultar por atención online <ArrowUpRight size={18} />
              </a>
            </div>
          </section>

          <section
            className="cg-about cg-container"
            id="camila"
            aria-labelledby="cg-about-heading"
          >
            <div className="cg-about-photo-wrap cg-reveal">
              <Portrait index={2} className="cg-about-photo" />
              <span className="cg-about-photo-tag">
                <Flower2 size={18} />
                MATRONA GUÍA
              </span>
              <div className="cg-about-badge">
                <GraduationCap size={25} strokeWidth={1.3} />
                <span>
                  Formación con
                  <br />
                  <strong>excelencia.</strong>
                </span>
              </div>
            </div>
            <div className="cg-about-copy cg-reveal">
              <span className="cg-eyebrow">CONOCE A TU MATRONA</span>
              <h2 id="cg-about-heading">
                Hola, soy
                <br />
                <em>Camila Rojas.</em>
              </h2>
              <p className="cg-about-lead">{profile.education}</p>
              <div className="cg-about-tags">
                <span>
                  USS · {profile.distinction} {profile.graduationYear}
                </span>
                <span>Atención desde los {profile.minAge} años</span>
              </div>
              <p>
                En Matrona Guía encontrarás un espacio para conversar con
                confianza sobre tu salud, con información clara y respeto por
                tus decisiones.
              </p>
              <div className="cg-about-values">
                <span>
                  <Heart size={19} />
                  Escucha sin juicios
                </span>
                <span>
                  <ShieldCheck size={19} />
                  Información para decidir
                </span>
                <span>
                  <Flower2 size={19} />
                  Cercanía en cada etapa
                </span>
              </div>
              <a
                href={profile.instagram}
                className="cg-about-social"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={19} />
                <span>
                  Conóceme en <strong>@matronaguia</strong>
                </span>
                <ArrowUpRight size={18} />
              </a>
            </div>
          </section>

          <section
            className="cg-modalities cg-container cg-reveal"
            id="atencion"
            aria-labelledby="cg-modalities-heading"
          >
            <div className="cg-section-heading">
              <div>
                <span className="cg-eyebrow">
                  CERCA DE TI, ESTÉS DONDE ESTÉS
                </span>
                <h2 id="cg-modalities-heading">
                  Dos formas de encontrarnos.
                  <br />
                  <em>El mismo cuidado.</em>
                </h2>
              </div>
            </div>
            <div className="cg-modality-grid">
              <article>
                <span className="cg-modality-icon">
                  <MapPin size={27} strokeWidth={1.3} />
                </span>
                <span className="cg-eyebrow">ÑUÑOA, SANTIAGO</span>
                <h3>Atención presencial</h3>
                <p>{profile.address}</p>
                <ul>
                  <li>
                    <CalendarDays size={16} />
                    {profile.presentialSchedule}
                  </li>
                  <li>
                    <Clock3 size={16} />
                    Duración: {profile.presentialDuration}
                  </li>
                </ul>
                <div>
                  <a
                    className="cg-text-link"
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cómo llegar <ArrowUpRight size={17} />
                  </a>
                  <button
                    className="cg-text-link"
                    onClick={() => setMapOpen((v) => !v)}
                    aria-expanded={mapOpen}
                    aria-controls="cg-map"
                  >
                    {mapOpen ? "Ocultar mapa" : "Ver mapa"}
                    <MapPin size={16} />
                  </button>
                </div>
              </article>
              <article>
                <span className="cg-modality-icon">
                  <Globe2 size={27} strokeWidth={1.3} />
                </span>
                <span className="cg-eyebrow">PARA TODO CHILE</span>
                <h3>Atención online</h3>
                <p>
                  Un espacio para conversar por videollamada o chat, desde donde
                  te sientas cómoda.
                </p>
                <ul>
                  <li>
                    <Globe2 size={16} />
                    Videollamada y chat
                  </li>
                  <li>
                    <Clock3 size={16} />
                    Duración: {profile.onlineDuration}
                  </li>
                </ul>
                <button
                  className="cg-text-link"
                  onClick={() => openBooking("online-ginecologia")}
                >
                  Consultar por atención online
                  <ArrowUpRight size={17} />
                </button>
              </article>
            </div>
            <div id="cg-map" hidden={!mapOpen} className="cg-map-wrap">
              {mapOpen && (
                <iframe
                  title="Ubicación de la consulta de Matrona Guía en Ñuñoa"
                  src="https://maps.google.com/maps?q=Carmen%20Covarrubias%2032%2C%20%C3%91u%C3%B1oa%2C%20Santiago&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}
            </div>
          </section>
          <section
            className="cg-pricing cg-container cg-reveal"
            id="valores"
            aria-labelledby="cg-pricing-heading"
          >
            <div className="cg-section-heading">
              <div>
                <span className="cg-eyebrow">
                  INFORMACIÓN CLARA PARA DECIDIR
                </span>
                <h2 id="cg-pricing-heading">
                  Conoce los valores
                  <br />
                  <em>de tu atención.</em>
                </h2>
              </div>
              <span className="cg-pricing-currency">PESOS CHILENOS · CLP</span>
            </div>
            <div
              className="cg-price-tabs"
              role="group"
              aria-label="Modalidad de los valores"
            >
              {priceGroups.map((group) => (
                <button
                  key={group.id}
                  aria-pressed={priceMode === group.id}
                  onClick={() => setPriceMode(group.id)}
                >
                  {group.title}
                </button>
              ))}
            </div>
            <div className="cg-pricing-table">
              <table>
                <caption className="sr-only">
                  Valores de {selectedPriceGroup.title}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Atención</th>
                    <th scope="col">Valor</th>
                    <th scope="col">
                      <span className="sr-only">Solicitar atención</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPriceGroup.services.map((service) => (
                    <tr key={service.id}>
                      <th scope="row">
                        <span>{service.title}</span>
                        {service.priceNote && (
                          <small>{service.priceNote}</small>
                        )}
                      </th>
                      <td>
                        <span>
                          {service.from ? "Desde " : ""}
                          {formatPriceCLP(service.price)}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => openBooking(service.id)}
                          aria-label={`Agendar ${service.title}`}
                        >
                          <CalendarDays size={17} />
                          <span>Agendar</span>
                          <ArrowUpRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="cg-price-note">
              Los valores pueden actualizarse. Confirma el detalle de tu
              atención al coordinar tu cita.{" "}
              <a
                href={whatsapp(
                  "¡Hola, Camila! Quisiera confirmar el valor de una atención.",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Consultar por WhatsApp <ArrowUpRight size={14} />
              </a>
            </p>
          </section>

          <section className="cg-how-section">
            <div className="cg-container">
              <div className="cg-section-heading cg-reveal">
                <div>
                  <span className="cg-eyebrow">TU PRÓXIMO PASO</span>
                  <h2>
                    Agendar puede
                    <br />
                    ser <em>así de simple.</em>
                  </h2>
                </div>
                <p>
                  Coordinación personal,
                  <br />
                  desde el primer mensaje.
                </p>
              </div>
              <div className="cg-how-grid cg-reveal">
                {[
                  {
                    n: "01",
                    Icon: Flower2,
                    title: "Elige tu atención",
                    text: "Revisa los servicios y sus valores. Si tienes dudas, puedes pedir orientación.",
                  },
                  {
                    n: "02",
                    Icon: CalendarDays,
                    title: "Propón tu momento",
                    text: "Indica una fecha y un horario preferidos en la solicitud de cita.",
                  },
                  {
                    n: "03",
                    Icon: MessageCircle,
                    title: "Confirma con Camila",
                    text: "Envía el mensaje por WhatsApp y coordina los detalles de tu atención.",
                  },
                ].map(({ n, Icon, title, text }) => (
                  <div key={n}>
                    <div className="cg-how-top">
                      <span>{n}</span>
                      <Icon size={25} strokeWidth={1.2} />
                    </div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
              <div className="cg-reservation-terms">
                <div>
                  <strong>Atención online</strong>
                  <span>Pago del valor completo de tu atención.</span>
                </div>
                <div>
                  <strong>Atención presencial</strong>
                  <span>
                    Abono de $10.000 por transferencia para reservar tu hora.
                  </span>
                </div>
                <div>
                  <strong>Si necesitas reagendar</strong>
                  <span>
                    Avisa con al menos 2 días hábiles de anticipación.
                  </span>
                </div>
              </div>
              <button className="cg-button" onClick={() => openBooking()}>
                Agendar una cita <ArrowUpRight size={18} />
              </button>
            </div>
          </section>

          <Education />
          <PatientExperiences />
          <section
            className="cg-faq cg-container"
            id="preguntas"
            aria-labelledby="cg-faq-heading"
          >
            <div className="cg-faq-heading cg-reveal">
              <span className="cg-eyebrow">RESOLVAMOS TUS DUDAS</span>
              <h2 id="cg-faq-heading">
                Preguntar también
                <br />
                es <em>cuidarte.</em>
              </h2>
              <a
                className="cg-text-link"
                href={whatsapp()}
                target="_blank"
                rel="noopener noreferrer"
              >
                Hacer otra pregunta <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="cg-faq-list cg-reveal">
              {faqs.map(([question, answer], i) => (
                <div className="cg-faq-item" key={question}>
                  <h3>
                    <button
                      aria-expanded={faq === i}
                      aria-controls={`cg-faq-${i}`}
                      onClick={() => setFaq(faq === i ? null : i)}
                    >
                      {question}
                      <Plus
                        size={19}
                        className={faq === i ? "cg-plus-open" : ""}
                      />
                    </button>
                  </h3>
                  <div id={`cg-faq-${i}`} hidden={faq !== i}>
                    <p>{answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            className="cg-contact cg-container"
            id="contacto"
            aria-labelledby="cg-contact-heading"
          >
            <div className="cg-contact-card">
              <div className="cg-contact-decoration" aria-hidden="true">
                <Flower2 strokeWidth={0.5} />
              </div>
              <div className="cg-contact-top">
                <span className="cg-contact-avatar">
                  <Portrait />
                </span>
                <div>
                  <strong>Matrona {profile.fullName}</strong>
                  <span>Ñuñoa · Online para todo Chile</span>
                </div>
                <span className="cg-contact-label">CONVERSEMOS</span>
              </div>
              <div className="cg-contact-body">
                <div>
                  <span className="cg-eyebrow">AQUÍ EMPIEZA TU CUIDADO</span>
                  <h2>
                    Una conversación.
                    <br />
                    <em>Un momento para ti.</em>
                  </h2>
                  <p>
                    Escríbeme para consultar por una atención o coordinemos
                    juntas tu próxima cita.
                  </p>
                </div>
                <div className="cg-contact-actions">
                  <button
                    className="cg-button cg-button-light"
                    onClick={() => openBooking()}
                  >
                    <CalendarDays size={19} />
                    Agendar mi cita
                    <ArrowUpRight size={19} />
                  </button>
                  <a
                    href={whatsapp()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={19} />
                    Escribir por WhatsApp
                    <ArrowUpRight size={17} />
                  </a>
                </div>
              </div>
            </div>
            <ContactForm />
          </section>
        </main>
        <footer
          className="cg-footer cg-container"
          inert={menu ? true : undefined}
        >
          <div className="cg-footer-top">
            <Brand />
            <p>Tu bienestar, con una guía cercana.</p>
            <div>
              <a
                href={profile.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
                <Instagram size={17} />
              </a>
              <a
                href={profile.tiktok}
                target="_blank"
                rel="noopener noreferrer"
              >
                TikTok
                <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
          <div className="cg-footer-details">
            <span>
              <MapPin size={16} />
              {profile.address}
            </span>
            <span>
              <CalendarDays size={16} />
              {profile.presentialSchedule}
            </span>
            <a href={`mailto:${profile.email}`}>
              <Mail size={16} />
              {profile.email}
            </a>
          </div>
          <div className="cg-footer-bottom">
            <span>
              © {new Date().getFullYear()} Matrona Guía · Camila Rojas
            </span>
            <a href="tel:+56975898382">+56 9 7589 8382</a>
            <span>Ñuñoa, Santiago · Online para todo Chile</span>
          </div>
        </footer>
        {pastHero && (
          <a
            className="cg-whatsapp-float"
            href={whatsapp()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Conversar con Camila por WhatsApp"
          >
            <MessageCircle size={22} />
            <span>¿Conversamos?</span>
          </a>
        )}
        {scrollTop && pastHero && (
          <button
            className="cg-back-top"
            aria-label="Volver al inicio"
            onClick={() => {
              document.getElementById("inicio")?.scrollIntoView({
                behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "instant"
                  : "smooth",
              });
              document.getElementById("inicio")?.focus({ preventScroll: true });
            }}
          >
            <ArrowUpRight size={19} />
          </button>
        )}
      </div>
      {detail && (
        <Modal
          onClose={closeDetail}
          title={detail.title}
          className="service-modal cg-detail-modal"
        >
          <span className="detail-icon">
            <detail.Icon size={32} strokeWidth={1.3} />
          </span>
          <span className="eyebrow">UN ESPACIO PARA TU SALUD</span>
          <h2>{detail.title}</h2>
          <p className="modal-description">{detail.description}</p>
          <p className="cg-catalog-detail-note">
            Conversemos para coordinar la modalidad y la atención que necesitas.
            Los procedimientos se realizan de manera presencial.
          </p>
          <a
            className="button full-width"
            href={whatsapp(
              `¡Hola, Camila! Me gustaría consultar por ${detail.title} y coordinar una atención.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar por WhatsApp
            <ArrowUpRight size={18} />
          </a>
        </Modal>
      )}
      {booking && (
        <Booking initialService={booking.service} onClose={closeBooking} />
      )}
    </>
  );
}
