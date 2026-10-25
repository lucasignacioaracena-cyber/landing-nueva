import {
  Baby,
  ClipboardCheck,
  Flower2,
  Heart,
  HeartHandshake,
  MessageCircle,
  Microscope,
  Pill,
  ShieldCheck,
  Sprout,
  Stethoscope,
  Sun,
  Syringe,
} from "lucide-react";

export const PHONE = "56975898382";
export const whatsapp = (
  message = "¡Hola, Matrona Guía! Me gustaría conocer más sobre la atención y solicitar una cita.",
) => `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;

export const profile = {
  name: "Camila Rojas",
  fullName: "Camila Rojas Torres",
  role: "Matrona",
  education:
    "Matrona egresada de la Universidad San Sebastián en 2024 con Distinción Máxima. Licenciada en Obstetricia y Puericultura.",
  university: "Universidad San Sebastián",
  graduationYear: 2024,
  distinction: "Distinción Máxima",
  minAge: 10,
  location: "Ñuñoa, Santiago",
  address: "Carmen Covarrubias 32, Ñuñoa, Santiago, Chile",
  coverage: "Atención presencial en Ñuñoa y online para todo Chile.",
  presentialSchedule: "Viernes de 10:00 a 16:00 horas",
  presentialDuration: "Aproximadamente 1 hora",
  onlineDuration: "Aproximadamente 45 minutos",
  presentialDurationMinutes: 60,
  onlineDurationMinutes: 45,
  depositAmount: 10000,
  onlinePaymentPolicy: "Pago completo del valor de la atención.",
  presentialPaymentPolicy: "Abono de $10.000 CLP para asegurar la reserva.",
  cancellationNotice: "2 días hábiles",
  email: "mat.camilarojas@gmail.com",
  instagram: "https://www.instagram.com/matronaguia/",
  tiktok: "https://www.tiktok.com/@matronaguia",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Carmen%20Covarrubias%2032%2C%20%C3%91u%C3%B1oa%2C%20Santiago%2C%20Chile",
};

export const categories = [
  { id: "todos", label: "Todos", Icon: Flower2 },
  { id: "examenes", label: "Exámenes", Icon: Microscope },
  { id: "anticoncepcion", label: "Anticoncepción", Icon: ShieldCheck },
  { id: "inyectables", label: "Inyectables", Icon: Syringe },
];

export const formatPriceCLP = (price) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(price);

export const services = [
  {
    id: "pap",
    title: "Toma de PAP",
    category: "examenes",
    Icon: Microscope,
    color: "rose",
    price: 20000,
    modality: "presencial",
    priceNote: "Incluye kit de muestra y entrega de resultados.",
    description:
      "Toma de PAP con kit de muestra y entrega de resultados incluidos.",
    detail:
      "El valor de la toma de PAP incluye el kit de muestra y la entrega de resultados. Coordina tu atención directamente con Camila por WhatsApp.",
    points: [
      "Kit de muestra incluido",
      "Entrega de resultados incluida",
      "Valor: $20.000 CLP",
    ],
  },
  {
    id: "insercion-implante",
    title: "Inserción de Implanon o Levoplant",
    category: "anticoncepcion",
    Icon: ShieldCheck,
    color: "sage",
    price: 40000,
    modality: "presencial",
    priceNote: "No incluye el dispositivo.",
    description: "Inserción de implante subdérmico Implanon o Levoplant.",
    detail:
      "Inserción presencial de Implanon o Levoplant en Ñuñoa, Santiago. El valor no incluye el dispositivo, que se paga aparte. Coordina los detalles por WhatsApp.",
    points: [
      "Implanon o Levoplant",
      "No incluye el dispositivo",
      "Atención presencial en Ñuñoa",
      "Valor: $40.000 CLP",
    ],
  },
  {
    id: "insercion-diu",
    title: "Inserción de DIU",
    category: "anticoncepcion",
    Icon: ShieldCheck,
    color: "peach",
    price: 40000,
    modality: "presencial",
    priceNote: "No incluye el dispositivo.",
    description: "Inserción de DIU de cobre o Silverflex.",
    detail:
      "Inserción presencial de DIU de cobre o Silverflex en Ñuñoa, Santiago. El valor no incluye el dispositivo, que se paga aparte. Coordina los detalles por WhatsApp.",
    points: [
      "DIU de cobre o Silverflex",
      "No incluye el dispositivo",
      "Atención presencial en Ñuñoa",
      "Valor: $40.000 CLP",
    ],
  },
  {
    id: "extraccion-implante",
    title: "Extracción de implante subdérmico",
    category: "anticoncepcion",
    Icon: ShieldCheck,
    color: "lilac",
    price: 35000,
    modality: "presencial",
    priceNote: "Atención presencial.",
    description: "Atención para la extracción de implantes subdérmicos.",
    detail:
      "Solicita una atención para la extracción de tu implante subdérmico. Los detalles y la disponibilidad se coordinan personalmente por WhatsApp.",
    points: [
      "Extracción de implante subdérmico",
      "Coordinación directa con Camila",
      "Valor: $35.000 CLP",
    ],
  },
  {
    id: "extraccion-diu",
    title: "Extracción de DIU",
    category: "anticoncepcion",
    Icon: ShieldCheck,
    color: "rose",
    price: 40000,
    modality: "presencial",
    priceNote: "Atención presencial.",
    description: "Atención para la extracción de un dispositivo intrauterino.",
    detail:
      "Coordina una atención para la extracción de DIU. Consulta la disponibilidad y los detalles de la atención por WhatsApp.",
    points: [
      "Extracción de dispositivo intrauterino",
      "Coordinación directa con Camila",
      "Valor: $40.000 CLP",
    ],
  },
  {
    id: "inyectable",
    title: "Inyectable IM o vacuna",
    category: "inyectables",
    Icon: Syringe,
    color: "peach",
    price: 15000,
    modality: "presencial",
    priceNote: "Solo administración. Medicamento no incluido.",
    description: "Administración de inyectable intramuscular o vacuna.",
    detail:
      "Administración presencial de un inyectable intramuscular o una vacuna en Ñuñoa, Santiago. El valor corresponde solo a la administración; el medicamento se paga aparte. Coordina los detalles por WhatsApp.",
    points: [
      "Inyectable intramuscular o vacuna",
      "Solo administración; medicamento no incluido",
      "Valor: $15.000 CLP",
    ],
  },
];

export const catalogCategories = [
  { id: "todos", label: "Todos", Icon: Flower2 },
  { id: "consultas", label: "Consultas", Icon: Stethoscope },
  { id: "anticoncepcion", label: "Anticoncepción", Icon: ShieldCheck },
  { id: "procedimientos", label: "Procedimientos", Icon: Syringe },
  { id: "bienestar", label: "Bienestar", Icon: Heart },
];

// El catálogo describe las áreas de atención. Sus tarjetas no muestran valores.
export const catalogServices = [
  {
    id: "consultas-ginecologicas",
    title: "Consultas ginecológicas",
    category: "consultas",
    Icon: Stethoscope,
    description:
      "Un espacio para conocer tu cuerpo y conversar sobre tu salud ginecológica.",
    bookingServiceId: "presencial-consulta-ginecologica",
  },
  {
    id: "controles-prenatales",
    title: "Controles prenatales",
    category: "consultas",
    Icon: Baby,
    description:
      "Acompañamiento cercano durante el embarazo, online y presencial.",
    bookingServiceId: "presencial-prenatal",
  },
  {
    id: "consulta-preconcepcional",
    title: "Consulta preconcepcional",
    category: "consultas",
    Icon: Sprout,
    description:
      "Conversemos sobre tu salud y tus preguntas antes de buscar un embarazo.",
    bookingServiceId: "presencial-preconcepcional",
  },
  {
    id: "metodos-anticonceptivos",
    title: "Métodos anticonceptivos",
    category: "anticoncepcion",
    Icon: Pill,
    description:
      "Información para elegir con confianza un método que se adapte a ti.",
    bookingServiceId: "online-mac",
  },
  {
    id: "metodos-larga-duracion",
    title: "Inserción de métodos de larga duración",
    category: "procedimientos",
    Icon: ShieldCheck,
    description:
      "Atención presencial para la inserción de DIU e implantes subdérmicos.",
    bookingServiceId: "insercion-implante",
  },
  {
    id: "inyecciones",
    title: "Inyecciones",
    category: "procedimientos",
    Icon: Syringe,
    description:
      "Administración presencial de inyectables intramusculares y vacunas.",
    bookingServiceId: "inyectable",
  },
  {
    id: "revision-examenes",
    title: "Revisión de exámenes",
    category: "consultas",
    Icon: ClipboardCheck,
    description:
      "Revisemos tus resultados y conversemos sobre los siguientes pasos.",
    bookingServiceId: "online-examenes",
  },
  {
    id: "salud-sexual-reproductiva",
    title: "Salud sexual y reproductiva",
    category: "bienestar",
    Icon: HeartHandshake,
    description:
      "Escucha y orientación para cuidar tu salud sexual y reproductiva, sin juicios.",
    bookingServiceId: "online-ginecologia",
  },
  {
    id: "climaterio-menopausia",
    title: "Climaterio y menopausia",
    category: "bienestar",
    Icon: Sun,
    description:
      "Un espacio para acompañarte en los cambios hormonales y esta etapa de tu vida.",
    bookingServiceId: "online-climaterio",
  },
  {
    id: "fertilidad",
    title: "Fertilidad",
    category: "bienestar",
    Icon: Flower2,
    description:
      "Conversemos sobre tu fertilidad, tus preguntas y tus proyectos.",
    bookingServiceId: "online-preconcepcional",
  },
  {
    id: "otros-servicios",
    title: "Otros servicios",
    category: "consultas",
    Icon: MessageCircle,
    description:
      "Si no sabes qué atención necesitas, cuéntame qué estás buscando.",
    bookingServiceId: null,
  },
];

const consultation = (id, title, price, mode, Icon, from = false) => ({
  id,
  title,
  price,
  mode,
  Icon,
  from,
  modality: mode === "online" ? "online" : "presencial",
  priceNote:
    mode === "online"
      ? "Atención online para todo Chile."
      : "Atención presencial en Ñuñoa.",
});
const onlineServices = [
  consultation(
    "online-ginecologia",
    "Consulta ginecológica",
    15000,
    "online",
    Stethoscope,
  ),
  consultation(
    "online-preconcepcional",
    "Control preconcepcional",
    20000,
    "online",
    Sprout,
  ),
  consultation("online-mac", "Inicio de MAC", 20000, "online", Pill),
  consultation(
    "online-climaterio",
    "Control de climaterio y menopausia",
    20000,
    "online",
    Sun,
  ),
  consultation(
    "online-prenatal",
    "Acompañamiento prenatal",
    20000,
    "online",
    Baby,
  ),
  consultation(
    "online-chat",
    "Consulta por chat",
    5000,
    "online",
    MessageCircle,
    true,
  ),
  consultation(
    "online-examenes",
    "Revisión de exámenes u orden de exámenes",
    5000,
    "online",
    ClipboardCheck,
  ),
  consultation("online-recetas", "Emisión de recetas", 5000, "online", Pill),
];
const presentialServices = [
  consultation(
    "presencial-consulta-ginecologica",
    "Consulta ginecológica específica",
    25000,
    "presencial",
    Stethoscope,
  ),
  consultation(
    "presencial-control-ginecologico",
    "Control ginecológico",
    30000,
    "presencial",
    Flower2,
  ),
  consultation(
    "presencial-preconcepcional",
    "Control preconcepcional",
    30000,
    "presencial",
    Sprout,
  ),
  consultation(
    "presencial-prenatal",
    "Control prenatal",
    30000,
    "presencial",
    Baby,
  ),
  consultation(
    "presencial-control-pap",
    "Control ginecológico más toma de PAP",
    35000,
    "presencial",
    Microscope,
  ),
];
const procedureServices = services.map((service) => ({
  ...service,
  mode: "procedimientos",
  from: false,
}));

export const priceGroups = [
  {
    id: "online",
    title: "Atenciones online",
    description:
      "Videollamada y chat para todo Chile. Aproximadamente 45 minutos.",
    services: onlineServices,
  },
  {
    id: "presencial",
    title: "Atenciones presenciales",
    description: "Viernes de 10:00 a 16:00 en Ñuñoa. Aproximadamente 1 hora.",
    services: presentialServices,
  },
  {
    id: "procedimientos",
    title: "Procedimientos y exámenes",
    description: "Atención presencial en Ñuñoa. Viernes de 10:00 a 16:00.",
    services: procedureServices,
  },
];
export const bookingServices = priceGroups.flatMap((group) => group.services);
export const formatServicePrice = (service) =>
  `${service.from ? "Desde " : ""}${formatPriceCLP(service.price)} CLP`;

export const getToday = () => {
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
export const dateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export const formatDate = (date) =>
  date.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
