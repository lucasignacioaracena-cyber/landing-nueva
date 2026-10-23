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
  categories,
  formatPriceCLP,
  profile,
  services,
  whatsapp,
} from "./content";
import { photos } from "./photos";

type Service = (typeof services)[number];
const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const faqs = [
  [
    "¿Dónde atiende Camila?",
    "La atención presencial es en Ñuñoa, Santiago. También ofrece atención online para todo Chile. Escríbele por WhatsApp para coordinar la modalidad y los detalles de tu consulta.",
  ],
  [
    "¿Qué incluye la toma de PAP?",
    "El valor de $20.000 incluye el kit de muestra y la entrega de resultados. Puedes coordinar tu atención presencial desde el botón para agendar.",
  ],
  [
    "¿Los valores de inserción incluyen el dispositivo?",
    "No. Los $40.000 de inserción de Implanon o Levoplant y los $40.000 de inserción de DIU corresponden al procedimiento. El dispositivo se paga aparte.",
  ],
  [
    "¿Qué incluyen los $15.000 del inyectable?",
    "El valor corresponde solo a la administración del inyectable intramuscular o vacuna. El medicamento no está incluido.",
  ],
  [
    "¿Cómo se confirma mi cita?",
    "Elige tu atención y una fecha y horario preferidos. Al terminar se abrirá WhatsApp con tu solicitud preparada. Envía el mensaje para coordinar y confirmar personalmente la disponibilidad.",
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
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const filtered = services.filter(
    (s) =>
      (category === "todos" || s.category === category) &&
      normalize(`${s.title} ${s.description} ${s.detail}`).includes(
        normalize(query.trim()),
      ),
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
    const update = () => setScrollTop(window.scrollY > 650);
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
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
        <header className="cg-header">
          <div className="cg-container cg-header-inner">
            <Brand />
            <nav className="cg-desktop-nav" aria-label="Navegación principal">
              <a href="#servicios">Servicios</a>
              <a href="#camila">Conoce a Camila</a>
              <a href="#preguntas">Preguntas frecuentes</a>
            </nav>
            <div className="cg-header-actions">
              <button
                className="cg-button cg-header-book"
                onClick={() => openBooking()}
                aria-label="Agendar una cita"
              >
                <CalendarDays size={17} />
                <span>Agendar una cita</span>
                <ArrowUpRight size={16} />
              </button>
              <button
                className="cg-menu-button"
                ref={menuButtonRef}
                onClick={() => setMenu((v) => !v)}
                aria-label={menu ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={menu}
                aria-controls="cg-mobile-menu"
              >
                {menu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </header>
        {menu && (
          <div
            className="cg-mobile-menu"
            id="cg-mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            tabIndex={-1}
          >
            <span className="cg-eyebrow">UN ESPACIO PARA TI</span>
            <nav>
              <a href="#servicios" onClick={() => setMenu(false)}>
                Servicios <ArrowUpRight />
              </a>
              <a href="#camila" onClick={() => setMenu(false)}>
                Conoce a Camila <ArrowUpRight />
              </a>
              <a href="#preguntas" onClick={() => setMenu(false)}>
                Preguntas frecuentes <ArrowUpRight />
              </a>
              <button onClick={() => openBooking()}>
                Agendar mi cita <ArrowUpRight />
              </button>
            </nav>
            <a href="tel:+56975898382" className="cg-menu-phone">
              +56 9 7589 8382
            </a>
          </div>
        )}
        <main inert={menu ? true : undefined}>
          <section
            id="inicio"
            className="cg-hero cg-container"
            aria-labelledby="cg-hero-heading"
            tabIndex={-1}
          >
            <div className="cg-hero-copy">
              <span className="cg-location-pill">
                <span />
                Ñuñoa, Santiago · Online en todo Chile
              </span>
              <h1 id="cg-hero-heading">
                Tu bienestar,
                <br />
                en buenas
                <br />
                <em>manos.</em>
                <Flower2
                  className="cg-title-flower"
                  size={57}
                  strokeWidth={1}
                  aria-hidden="true"
                />
              </h1>
              <p>
                Un espacio para escucharte, resolver tus dudas y acompañarte en
                el cuidado de tu salud.
              </p>
              <div className="cg-hero-actions">
                <button className="cg-button" onClick={() => openBooking()}>
                  Encuentra tu atención <ArrowUpRight size={20} />
                </button>
                <a
                  href={whatsapp()}
                  className="cg-round-button"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Conversar por WhatsApp"
                >
                  <MessageCircle size={21} />
                </a>
              </div>
              <div className="cg-hero-professional">
                <span className="cg-graduate">
                  <GraduationCap size={24} strokeWidth={1.4} />
                </span>
                <div>
                  <strong>{profile.fullName}</strong>
                  <span>
                    Licenciada con excelencia
                    <br />
                    {profile.university}
                  </span>
                </div>
              </div>
            </div>
            <div className="cg-story-card">
              <Portrait
                index={portrait}
                loading="eager"
                className="cg-story-photo"
              />
              <div className="cg-story-shade" />
              <div className="cg-story-top">
                <span>
                  <Flower2 size={21} strokeWidth={1.2} />
                  MATRONA GUÍA
                </span>
                {photos.some((photo) => photo.src) && (
                  <div
                    className="cg-story-progress"
                    role="group"
                    aria-label="Fotografías de Camila"
                  >
                    {photos.map((photo, i) => (
                      <button
                        key={photo.label}
                        aria-label={`Ver foto ${i + 1}: ${photo.label}`}
                        aria-pressed={portrait === i}
                        onClick={() => setPortrait(i)}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="cg-story-focus" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="cg-story-bottom">
                <span className="cg-story-tag">
                  <Heart size={13} /> SALUD CON CERCANÍA
                </span>
                <h2>
                  {photos[portrait].label.split(" ").slice(0, 2).join(" ")}
                  <br />
                  {photos[portrait].label.split(" ").slice(2).join(" ")}
                  <span>.</span>
                </h2>
                <a href="#servicios" className="cg-story-link">
                  <span className="cg-story-arrow">
                    <ArrowDownRight size={23} />
                  </span>
                  <span>Descubre cómo te acompaño</span>
                  <ArrowDown size={18} />
                </a>
              </div>
            </div>
          </section>

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
              <span className="cg-price-unit">VALORES EN PESOS CHILENOS</span>
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
            <div className="cg-service-grid">
              {filtered.map((service, i) => (
                <article
                  className={`cg-service-card cg-service-${service.category}`}
                  key={service.id}
                  aria-labelledby={`service-${service.id}`}
                >
                  <div className="cg-service-art" aria-hidden="true">
                    <Portrait
                      index={
                        service.category === "examenes"
                          ? 2
                          : service.category === "inyectables"
                            ? 1
                            : services.findIndex(
                                (item) => item.id === service.id,
                              ) % 3
                      }
                      className="cg-service-photo"
                    />
                  </div>
                  <div className="cg-service-overlay" />
                  <div className="cg-service-top">
                    <span>
                      {categories.find((c) => c.id === service.category)?.label}
                    </span>
                    <button
                      className="cg-service-info"
                      onClick={() => setDetail(service)}
                      aria-label={`Ver detalles de ${service.title}`}
                    >
                      <Info size={22} strokeWidth={1.6} />
                    </button>
                  </div>
                  <div className="cg-service-main">
                    <span className="cg-service-mode">
                      <MapPin size={12} /> PRESENCIAL
                    </span>
                    <h3 id={`service-${service.id}`}>{service.title}</h3>
                    <p>{service.priceNote}</p>
                  </div>
                  <div className="cg-service-bottom">
                    <div className="cg-service-price">
                      <strong>{formatPriceCLP(service.price)}</strong>
                      <span>CLP</span>
                    </div>
                    <div className="cg-service-actions">
                      <a
                        href={whatsapp(
                          `¡Hola, Camila! Quisiera consultar por ${service.title} (${formatPriceCLP(service.price)} CLP). ${service.priceNote}`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cg-card-chat"
                        aria-label={`Consultar por ${service.title} en WhatsApp`}
                      >
                        <MessageCircle size={21} />
                      </a>
                      <button
                        data-book={service.id}
                        className="cg-card-book"
                        onClick={() => openBooking(service.id)}
                        aria-label={`Agendar ${service.title}`}
                      >
                        <CalendarDays size={17} />
                        Agendar atención
                        <ArrowUpRight size={17} />
                      </button>
                    </div>
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
              <button className="cg-button" onClick={() => openBooking()}>
                Agendar una cita <ArrowUpRight size={18} />
              </button>
            </div>
          </section>

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
                  <strong>{profile.fullName}</strong>
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
          <div className="cg-footer-bottom">
            <span>
              © {new Date().getFullYear()} Matrona Guía · Camila Rojas
            </span>
            <a href="tel:+56975898382">+56 9 7589 8382</a>
            <span>Ñuñoa, Santiago · Online para todo Chile</span>
          </div>
        </footer>
        {scrollTop && (
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
          <span className="eyebrow">PROCEDIMIENTOS Y EXÁMENES</span>
          <h2>{detail.title}</h2>
          <span className="cg-detail-price">
            {formatPriceCLP(detail.price)} <small>CLP</small>
          </span>
          <p className="modal-description">{detail.detail}</p>
          <ul className="detail-points">
            {detail.points.map((point) => (
              <li key={point}>
                <CircleCheck size={17} />
                {point}
              </li>
            ))}
          </ul>
          <button
            className="button full-width"
            onClick={() => openBooking(detail.id)}
          >
            Agendar esta atención
            <ArrowUpRight size={18} />
          </button>
          <p className="modal-note">Atención presencial en Ñuñoa, Santiago.</p>
        </Modal>
      )}
      {booking && (
        <Booking initialService={booking.service} onClose={closeBooking} />
      )}
    </>
  );
}
