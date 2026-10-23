import { Flower2, Microscope, ShieldCheck, Syringe } from "lucide-react";

export const PHONE = "56975898382";
export const whatsapp = (
  message = "¡Hola, Matrona Guía! Me gustaría conocer más sobre la atención y solicitar una cita.",
) => `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;

export const profile = {
  name: "Camila Rojas",
  fullName: "Matrona Camila Rojas",
  role: "Matrona",
  education:
    "Licenciada en Obstetricia y Puericultura con excelencia de la Universidad San Sebastián.",
  university: "Universidad San Sebastián",
  location: "Ñuñoa, Santiago",
  coverage: "Atención presencial en Ñuñoa y online para todo Chile.",
  instagram: "https://www.instagram.com/matronaguia/",
  tiktok: "https://www.tiktok.com/@matronaguia",
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
