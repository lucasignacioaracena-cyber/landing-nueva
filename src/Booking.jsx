import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CircleDollarSign,
  Flower2,
  Heart,
  LockKeyhole,
  MessageCircle,
  X,
} from "lucide-react";
import {
  bookingServices,
  priceGroups,
  profile,
  getToday,
  dateKey,
  formatDate,
  formatPriceCLP,
  formatServicePrice,
  PHONE,
} from "./content";
import "./booking-addon.css";

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
  const initial = bookingServices.find((item) => item.id === initialService);
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState(initial?.mode || "presencial");
  const [service, setService] = useState(
    initial?.id || (initialService === "orientacion" ? "orientacion" : ""),
  );
  const [selectedDate, setSelectedDate] = useState(null);
  const [period, setPeriod] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const today = getToday();
  const [month, setMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const formRef = useRef(null);
  const modeRefs = useRef([]);
  const firstDay =
    (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;
  const daysCount = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const selectedServiceData = bookingServices.find(
    (item) => item.id === service,
  );
  const selectedService = selectedServiceData?.title || "Orientación general";
  const selectedPrice = selectedServiceData
    ? formatServicePrice(selectedServiceData)
    : "Consultar";
  const activeGroup = priceGroups.find((group) => group.id === mode);
  const isInPerson = mode !== "online";
  const modeLabel =
    mode === "online"
      ? "Online"
      : mode === "presencial"
        ? "Presencial"
        : "Procedimientos y exámenes presenciales";
  const duration = isInPerson
    ? profile.presentialDuration
    : profile.onlineDuration;
  const timeOptions = isInPerson
    ? [
        "10:00–11:00",
        "11:00–12:00",
        "12:00–13:00",
        "13:00–14:00",
        "14:00–15:00",
        "15:00–16:00",
      ]
    : ["Mañana", "Tarde", "A coordinar"];
  const isDateAllowed = (date) =>
    date > today && (!isInPerson || date.getDay() === 5);
  const canContinue =
    step === 1
      ? Boolean(service)
      : Boolean(selectedDate && isDateAllowed(selectedDate) && period);
  const changeMonth = (delta) =>
    setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));
  const changeMode = (next) => {
    if (next === mode) return;
    setMode(next);
    setService("");
    setSelectedDate(null);
    setPeriod("");
    setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };
  const navigateMode = (event, index) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % priceGroups.length;
    else if (event.key === "ArrowLeft")
      next = (index + priceGroups.length - 1) % priceGroups.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = priceGroups.length - 1;
    else return;
    event.preventDefault();
    changeMode(priceGroups[next].id);
    modeRefs.current[next]?.focus();
  };
  const depositText = !isInPerson
    ? selectedServiceData?.from
      ? `La atención online se confirma con el pago completo del valor acordado. ${selectedPrice}; confirma el valor final por WhatsApp antes de pagar.`
      : selectedServiceData
        ? `Pago completo de ${selectedPrice} para confirmar la atención online, a coordinar por WhatsApp.`
        : "La atención online se confirma con el pago completo del valor de la atención, a coordinar por WhatsApp."
    : `Abono de reserva de ${formatPriceCLP(profile.depositAmount)} CLP por transferencia bancaria para asegurar tu atención presencial, a coordinar por WhatsApp.`;
  const cancellationText = `Para cancelar o reagendar, avisa con un mínimo de ${profile.cancellationNotice}.`;
  const sendMessage = `¡Hola, Matrona Guía! Soy ${name.trim()}. Me gustaría solicitar una cita.\n\nMotivo: ${selectedService}\nModalidad: ${modeLabel}\nValor informado: ${selectedPrice}${selectedServiceData?.priceNote ? `\nDetalle del valor: ${selectedServiceData.priceNote}` : ""}\nFecha preferida: ${selectedDate ? formatDate(selectedDate) : ""}\nHorario preferido: ${period} (hora de Chile continental)\n${isInPerson ? `Lugar: ${profile.address}` : "Atención online para todo Chile."}\n\n${depositText}\n${cancellationText}\n\nQuedo pendiente de confirmar disponibilidad y coordinar los detalles de la atención. ¡Gracias!`;

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
              Elige la modalidad y el motivo de tu atención.
            </p>
            <div
              className="booking-mode-tabs"
              role="tablist"
              aria-label="Modalidad de atención"
            >
              {priceGroups.map((group, index) => (
                <button
                  key={group.id}
                  ref={(node) => {
                    modeRefs.current[index] = node;
                  }}
                  id={`booking-mode-${group.id}`}
                  role="tab"
                  aria-selected={mode === group.id}
                  aria-controls={`booking-options-${group.id}`}
                  tabIndex={mode === group.id ? 0 : -1}
                  onClick={() => changeMode(group.id)}
                  onKeyDown={(event) => navigateMode(event, index)}
                >
                  {group.id === "online"
                    ? "Online"
                    : group.id === "presencial"
                      ? "Presencial"
                      : "Procedimientos"}
                </button>
              ))}
            </div>
            <p className="booking-mode-note">{activeGroup.description}</p>
            <div
              id={`booking-options-${mode}`}
              className="booking-services"
              role="tabpanel"
              aria-labelledby={`booking-mode-${mode}`}
            >
              {[
                ...activeGroup.services,
                {
                  id: "orientacion",
                  title: "Necesito orientación",
                  Icon: MessageCircle,
                  price: null,
                  from: false,
                },
              ].map((item) => (
                <button
                  type="button"
                  className={`booking-service ${service === item.id ? "selected" : ""}`}
                  key={item.id}
                  aria-pressed={service === item.id}
                  onClick={() => setService(item.id)}
                >
                  <item.Icon size={21} strokeWidth={1.5} />
                  <span className="booking-service-label">
                    <span>{item.title}</span>
                    <small>
                      {item.price == null
                        ? "Valor a consultar"
                        : formatServicePrice(item)}
                    </small>
                  </span>
                  <span className="radio-circle">
                    {service === item.id && <span />}
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
              {isInPerson
                ? "Atención presencial los viernes, de 10:00 a 16:00. Elige una fecha y horario preferidos."
                : "Elige una fecha futura y una franja horaria para tu atención online."}{" "}
              La disponibilidad se confirma por WhatsApp.
            </p>
            <div className="booking-appointment-context">
              <span>{modeLabel}</span>
              <small>{duration}</small>
              {isInPerson && <p>{profile.address}</p>}
            </div>
            <div className="calendar">
              <div className="calendar-heading">
                <button
                  type="button"
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
                  type="button"
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
                      type="button"
                      key={i}
                      className={`calendar-day ${selected ? "selected" : ""} ${dateKey(date) === dateKey(today) ? "today" : ""}`}
                      disabled={!isDateAllowed(date)}
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
            <div
              className={`time-options ${isInPerson ? "booking-time-grid" : ""}`}
            >
              {timeOptions.map((time) => (
                <button
                  type="button"
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
                  Atención<strong>{selectedService}</strong>
                  <small>{modeLabel}</small>
                </span>
              </div>
              <div>
                <CircleDollarSign size={18} />
                <span>
                  Valor de la atención<strong>{selectedPrice}</strong>
                  {selectedServiceData?.priceNote && (
                    <small>{selectedServiceData.priceNote}</small>
                  )}
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
            <div className="booking-reservation-note">
              <strong>Reserva y cancelaciones</strong>
              <p>
                {depositText} Los datos de transferencia se coordinan
                personalmente.
              </p>
              <p>{cancellationText}</p>
            </div>
            <form
              id="booking-form"
              ref={formRef}
              action={`https://wa.me/${PHONE}`}
              method="get"
              acceptCharset="UTF-8"
              target="_blank"
              rel="noopener noreferrer"
              onSubmit={(event) => {
                if (!selectedDate || !isDateAllowed(selectedDate) || !period) {
                  event.preventDefault();
                  setSelectedDate(null);
                  setPeriod("");
                  setStep(2);
                  return;
                }
                if (!name.trim()) {
                  event.preventDefault();
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
                onChange={(event) => {
                  event.target.setCustomValidity("");
                  setName(event.target.value);
                }}
              />
              <label className="consent-label">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                />
                <span>
                  Entiendo que esta es una solicitud y que la disponibilidad, la
                  reserva y su confirmación se coordinan por WhatsApp.
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
          <button
            type="button"
            className="back-button"
            onClick={() => setStep(step - 1)}
          >
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
        Coordinación directa y personal. Sin pago online en este sitio.
      </p>
    </Modal>
  );
}
