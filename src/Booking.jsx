import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flower2,
  Heart,
  LockKeyhole,
  MessageCircle,
  X,
} from "lucide-react";
import { services, getToday, dateKey, formatDate } from "./content";

export function Modal({ onClose, title, children, className = "" }) {
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

export default function Booking({ initialService, onClose }) {
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
