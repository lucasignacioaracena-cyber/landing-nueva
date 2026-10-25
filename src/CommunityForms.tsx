import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import {
  ArrowUpRight,
  Check,
  Heart,
  LockKeyhole,
  MessageCircle,
  Send,
  Star,
} from "lucide-react";
import { PHONE, whatsapp } from "./content";
import "./community-forms.css";

type Testimonial = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
};
type FormState = "idle" | "sending" | "success" | "error";
const standalone = () => document.documentElement.dataset.standalone === "true";

async function submitRecord(
  endpoint: string,
  payload: Record<string, unknown>,
) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.ok !== true || typeof result.id !== "string")
    throw new Error(
      result?.error || "No pudimos guardar tu mensaje. Inténtalo nuevamente.",
    );
  return result;
}

function focusStatus(ref: { current: HTMLDivElement | null }) {
  requestAnimationFrame(() => ref.current?.focus({ preventScroll: true }));
}

export function PatientExperiences() {
  const isStandalone = standalone();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(!isStandalone);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  const [notice, setNotice] = useState("");
  const statusRef = useRef<HTMLDivElement>(null);
  const ratingRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (isStandalone) return;
    const controller = new AbortController();
    fetch("/api/testimonials", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        const result = await response.json();
        if (result?.ok !== true || !Array.isArray(result.testimonials))
          throw new Error();
        setTestimonials(result.testimonials);
      })
      .catch((error) => {
        if (error.name !== "AbortError") setLoadError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [isStandalone]);

  const selectRating = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      next = (index + 1) % 5;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = (index + 4) % 5;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 4;
    else return;
    event.preventDefault();
    setRating(next + 1);
    ratingRefs.current[next]?.focus();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const nameInput = form.querySelector<HTMLInputElement>("#cg-review-name");
    const commentInput =
      form.querySelector<HTMLTextAreaElement>("#cg-review-comment");
    if (!name.trim() || comment.trim().length < 10 || rating < 1 || !consent) {
      event.preventDefault();
      if (!name.trim()) {
        nameInput?.setCustomValidity("Escribe tu nombre o tus iniciales.");
        nameInput?.reportValidity();
      } else if (comment.trim().length < 10) {
        commentInput?.setCustomValidity(
          "Cuéntanos tu experiencia en al menos 10 caracteres.",
        );
        commentInput?.reportValidity();
      } else if (rating < 1) {
        setState("error");
        setNotice("Selecciona una valoración de 1 a 5 estrellas.");
        ratingRefs.current[0]?.focus();
      }
      return;
    }
    if (isStandalone) {
      setNotice(
        "Se abrirá WhatsApp con tu experiencia preparada. Envía el mensaje para compartirla con Camila.",
      );
      setState("success");
      return;
    }
    event.preventDefault();
    setState("sending");
    setNotice("");
    try {
      const result = await submitRecord("/api/testimonials", {
        name: name.trim(),
        rating,
        comment: comment.trim(),
        consent,
      });
      if (result.status !== "pending")
        throw new Error("No pudimos confirmar la revisión de tu experiencia.");
      setState("success");
      setNotice(
        "Gracias por compartir tu experiencia. Quedó guardada y pendiente de revisión; se publicará solo cuando Camila la apruebe.",
      );
      setName("");
      setRating(0);
      setComment("");
      setConsent(false);
      focusStatus(statusRef);
    } catch (error) {
      setState("error");
      setNotice(
        error instanceof Error
          ? error.message
          : "No pudimos guardar tu experiencia. Inténtalo nuevamente.",
      );
      focusStatus(statusRef);
    }
  };

  const message = `¡Hola, Camila! Quisiera compartir mi experiencia con Matrona Guía.\n\nNombre o iniciales: ${name.trim()}\nValoración: ${rating}/5\nExperiencia: ${comment.trim()}\n\nAutorizo la revisión y posible publicación de este testimonio. Entiendo que su publicación requiere tu aprobación.`;
  return (
    <section
      id="experiencias"
      className="cg-community cg-container"
      aria-labelledby="cg-experiences-heading"
    >
      <div className="cg-section-heading">
        <div>
          <span className="cg-eyebrow">LA CONFIANZA SE CONSTRUYE JUNTAS</span>
          <h2 id="cg-experiences-heading">
            Experiencias de
            <br />
            <em>mis pacientes.</em>
          </h2>
        </div>
        <p>
          Un espacio para compartir
          <br />
          cómo viviste tu atención.
        </p>
      </div>
      {testimonials.length > 0 && (
        <div className="cg-community-reviews">
          {testimonials.map((review) => (
            <article className="cg-community-review" key={review.id}>
              <div
                className="cg-community-review-stars"
                aria-label={`${review.rating} de 5 estrellas`}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={15}
                    fill={n <= review.rating ? "currentColor" : "none"}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p>“{review.comment}”</p>
              <span>{review.name}</span>
            </article>
          ))}
        </div>
      )}
      {loading && (
        <p className="cg-community-list-note" role="status">
          Cargando experiencias…
        </p>
      )}
      {loadError && (
        <p className="cg-community-list-note">
          Las experiencias no están disponibles en este momento. Puedes volver a
          intentarlo más tarde.
        </p>
      )}
      {!loading && !loadError && testimonials.length === 0 && (
        <p className="cg-community-list-note">
          <Heart size={16} strokeWidth={1.4} />
          Cada experiencia es personal. Si ya te atendiste con Camila, puedes
          compartir la tuya.
        </p>
      )}
      <div className="cg-community-review-layout">
        <div className="cg-community-review-intro">
          <span className="cg-community-seal">
            <Heart size={27} strokeWidth={1.1} />
          </span>
          <h3>
            Tu experiencia
            <br />
            también importa.
          </h3>
          <p>
            Comparte lo que significó para ti este espacio. Puedes usar tu
            nombre o solo tus iniciales.
          </p>
          <span className="cg-community-moderation">
            <Check size={16} />
            Las experiencias se revisan antes de publicarse.
          </span>
        </div>
        <form
          className="cg-community-form"
          action={`https://wa.me/${PHONE}`}
          method="get"
          target="_blank"
          rel="noopener noreferrer"
          onSubmit={onSubmit}
          aria-label="Compartir una experiencia"
        >
          <input type="hidden" name="text" value={message} />
          <div className="cg-community-field">
            <label htmlFor="cg-review-name">Nombre o iniciales</label>
            <input
              id="cg-review-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                e.target.setCustomValidity("");
              }}
              maxLength={80}
              required
              autoComplete="given-name"
              placeholder="Como prefieras aparecer"
            />
          </div>
          <fieldset className="cg-community-rating">
            <legend>¿Cómo fue tu atención?</legend>
            <div
              role="radiogroup"
              aria-label="Valoración de tu atención"
              aria-required="true"
            >
              {[1, 2, 3, 4, 5].map((n, i) => (
                <button
                  type="button"
                  key={n}
                  ref={(node) => {
                    ratingRefs.current[i] = node;
                  }}
                  role="radio"
                  aria-checked={rating === n}
                  aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}`}
                  tabIndex={rating === n || (!rating && n === 1) ? 0 : -1}
                  onClick={() => setRating(n)}
                  onKeyDown={(e) => selectRating(e, i)}
                >
                  <Star
                    size={25}
                    strokeWidth={1.4}
                    fill={n <= rating ? "currentColor" : "none"}
                  />
                </button>
              ))}
              <span aria-hidden="true">
                {rating ? `${rating} de 5` : "Elige tu valoración"}
              </span>
            </div>
          </fieldset>
          <div className="cg-community-field">
            <label htmlFor="cg-review-comment">Tu experiencia</label>
            <textarea
              id="cg-review-comment"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                e.target.setCustomValidity("");
              }}
              rows={4}
              minLength={10}
              maxLength={2000}
              required
              placeholder="Cuéntanos cómo te sentiste en tu atención"
            />
          </div>
          <label className="cg-community-consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
            />
            <span>
              Autorizo a Camila a revisar y, si la aprueba, publicar esta
              experiencia con el nombre o las iniciales que indiqué.
            </span>
          </label>
          <button
            className="cg-button"
            type="submit"
            disabled={state === "sending"}
          >
            {isStandalone ? <MessageCircle size={17} /> : <Send size={17} />}
            {state === "sending"
              ? "Guardando…"
              : isStandalone
                ? "Compartir por WhatsApp"
                : "Compartir mi experiencia"}
            <ArrowUpRight size={17} />
          </button>
          {isStandalone && (
            <p className="cg-community-form-note">
              Se abrirá WhatsApp para que envíes tu experiencia directamente a
              Camila. No se publica automáticamente.
            </p>
          )}
          <div
            ref={statusRef}
            className={`cg-community-status ${state === "error" ? "cg-community-status-error" : ""}`}
            role={state === "error" ? "alert" : "status"}
            aria-live="polite"
            tabIndex={-1}
          >
            {notice}
          </div>
        </form>
      </div>
    </section>
  );
}

export function ContactForm() {
  const isStandalone = standalone();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  const [notice, setNotice] = useState("");
  const statusRef = useRef<HTMLDivElement>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const nameInput = form.querySelector<HTMLInputElement>("#cg-contact-name");
    const messageInput = form.querySelector<HTMLTextAreaElement>(
      "#cg-contact-message",
    );
    if (name.trim().length < 2 || message.trim().length < 10 || !consent) {
      event.preventDefault();
      if (name.trim().length < 2) {
        nameInput?.setCustomValidity(
          "Escribe tu nombre en al menos 2 caracteres.",
        );
        nameInput?.reportValidity();
      } else if (message.trim().length < 10) {
        messageInput?.setCustomValidity(
          "Escribe tu consulta en al menos 10 caracteres.",
        );
        messageInput?.reportValidity();
      }
      return;
    }
    if (isStandalone) {
      setState("success");
      setNotice(
        "Se abrirá WhatsApp con tu consulta preparada. Envía el mensaje para compartirla con Camila.",
      );
      return;
    }
    event.preventDefault();
    setState("sending");
    setNotice("");
    try {
      await submitRecord("/api/contact", {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject,
        message: message.trim(),
        consent,
      });
      setState("success");
      setNotice(
        "Tu mensaje quedó registrado. Gracias por escribir a Matrona Guía. Para coordinar una hora, también puedes contactar a Camila por WhatsApp.",
      );
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
      setConsent(false);
      focusStatus(statusRef);
    } catch (error) {
      setState("error");
      setNotice(
        error instanceof Error
          ? error.message
          : "No pudimos guardar tu mensaje. Inténtalo nuevamente.",
      );
      focusStatus(statusRef);
    }
  };
  const whatsappText = `¡Hola, Camila! Quisiera hacer una consulta.\n\nNombre: ${name.trim()}\nCorreo: ${email.trim()}${phone.trim() ? `\nTeléfono: ${phone.trim()}` : ""}\nMotivo: ${subject}\nMensaje: ${message.trim()}\n\nAutorizo el uso de estos datos para responder mi consulta.`;

  return (
    <section
      id="formulario-contacto"
      className="cg-community cg-community-contact cg-container"
      aria-labelledby="cg-contact-form-heading"
    >
      <div className="cg-community-contact-intro">
        <span className="cg-eyebrow">CONVERSEMOS CON CALMA</span>
        <h2 id="cg-contact-form-heading">
          Estoy aquí
          <br />
          para <em>escucharte.</em>
        </h2>
        <p>
          Si tienes una pregunta sobre las atenciones o necesitas orientación
          para agendar, puedes dejarme un mensaje.
        </p>
        <a
          className="cg-text-link"
          href={whatsapp()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={18} />
          También puedes escribir por WhatsApp
          <ArrowUpRight size={17} />
        </a>
      </div>
      <form
        className="cg-community-form cg-community-contact-form"
        action={`https://wa.me/${PHONE}`}
        method="get"
        target="_blank"
        rel="noopener noreferrer"
        onSubmit={onSubmit}
        aria-label="Enviar una consulta a Camila"
      >
        <input type="hidden" name="text" value={whatsappText} />
        <div className="cg-community-two-fields">
          <div className="cg-community-field">
            <label htmlFor="cg-contact-name">Tu nombre</label>
            <input
              id="cg-contact-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                e.target.setCustomValidity("");
              }}
              minLength={2}
              maxLength={80}
              required
              autoComplete="given-name"
              placeholder="¿Cómo te llamas?"
            />
          </div>
          <div className="cg-community-field">
            <label htmlFor="cg-contact-email">Correo electrónico</label>
            <input
              id="cg-contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={254}
              required
              autoComplete="email"
              placeholder="tu@correo.cl"
            />
          </div>
        </div>
        <div className="cg-community-two-fields">
          <div className="cg-community-field">
            <label htmlFor="cg-contact-phone">
              Teléfono <span>(opcional)</span>
            </label>
            <input
              id="cg-contact-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              minLength={6}
              maxLength={30}
              pattern={String.raw`[+0-9 .\-\(\)]{6,30}`}
              autoComplete="tel"
              placeholder="+56 9"
            />
          </div>
          <div className="cg-community-field">
            <label htmlFor="cg-contact-subject">Motivo de tu consulta</label>
            <select
              id="cg-contact-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            >
              <option value="" disabled>
                Selecciona un motivo
              </option>
              <option>Agendar una atención</option>
              <option>Consulta sobre valores</option>
              <option>Atención online</option>
              <option>Otra consulta</option>
            </select>
          </div>
        </div>
        <div className="cg-community-field">
          <label htmlFor="cg-contact-message">Tu mensaje</label>
          <textarea
            id="cg-contact-message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              e.target.setCustomValidity("");
            }}
            rows={4}
            minLength={10}
            maxLength={3000}
            required
            placeholder="Cuéntame en qué puedo ayudarte"
          />
        </div>
        <label className="cg-community-consent">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
          />
          <span>
            Autorizo el uso de mi nombre, correo y los datos que incluí para
            responder esta consulta.
          </span>
        </label>
        <p className="cg-community-privacy">
          <LockKeyhole size={14} />
          Tus datos de contacto no se publican.
        </p>
        <button
          className="cg-button"
          type="submit"
          disabled={state === "sending"}
        >
          {isStandalone ? <MessageCircle size={17} /> : <Send size={17} />}
          {state === "sending"
            ? "Guardando…"
            : isStandalone
              ? "Enviar por WhatsApp"
              : "Enviar mi consulta"}
          <ArrowUpRight size={17} />
        </button>
        {isStandalone && (
          <p className="cg-community-form-note">
            Se abrirá WhatsApp para que envíes el mensaje directamente a Camila.
          </p>
        )}
        <div
          ref={statusRef}
          className={`cg-community-status ${state === "error" ? "cg-community-status-error" : ""}`}
          role={state === "error" ? "alert" : "status"}
          aria-live="polite"
          tabIndex={-1}
        >
          {notice}
        </div>
        {state === "error" && (
          <a
            className="cg-text-link"
            href={whatsapp()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Escribir por WhatsApp
            <ArrowUpRight size={16} />
          </a>
        )}
      </form>
    </section>
  );
}
