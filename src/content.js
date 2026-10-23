import { Baby, Flower2, Heart, Sprout } from "lucide-react";

export const PHONE = "56975898382";
export const whatsapp = (
  message = "¡Hola, Matrona Guía! Me gustaría conocer más sobre la atención y solicitar una cita.",
) => `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
export const services = [
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
