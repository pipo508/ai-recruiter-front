export const APP_NAME = "AI Talent";

export const PLACEHOLDERS = {
  SEARCH: "Ejemplo: Busco un desarrollador full-stack con 3 años de experiencia en React y Node.js, conocimientos en AWS y metodologías ágiles...",
  USER_ID: "ej. 12345 o email@ejemplo.com",
};

export const MESSAGES = {
  DESCRIPTION: "Describe el perfil ideal para tu empresa y deja que la IA encuentre los mejores candidatos",
  SUGGESTED_SEARCHES: "Búsquedas sugeridas:",
};

export const SEARCH_SUGGESTIONS = [
  "Desarrollador Frontend Senior",
  "Data Scientist",
  "Product Manager",
  "UX/UI Designer",
];

export const MAX_PARTICLES_MOBILE = 20;
export const PARTICLE_COUNT = 10;
export const MAX_PARTICLES = 150;
export const MAX_DISTANCE = 250;
export const FORCE_MULTIPLIER = 25;
export const PARTICLE_RADIUS_MIN = 1;
export const PARTICLE_RADIUS_MAX = 4;
export const SPEED_MIN = -0.5;
export const SPEED_MAX = 1.5;
export const CLICK_PARTICLE_RADIUS_MIN = 1;
export const CLICK_PARTICLE_RADIUS_MAX = 3;
export const CLICK_SPEED_MIN = -0.5;
export const CLICK_SPEED_MAX = 1.5;

export const MAX_CIRCLES = 100;
export const SPEED_MULTIPLIER = 0.7;
export const COLORSTATS = 'rgba(9, 22, 42, 0.94)';

export const PDF_PROCESSOR_CONSTANTS = {
  LABELS: {
    USER_ID: "ID de Usuario",
    PDF_FILES: "Archivos PDF",
    SUBMIT: "Subir Archivos",
  },
  PLACEHOLDERS: {
    USER_ID: "ej. 12345 o email@ejemplo.com",
  },
  COLORS: {
    PRIMARY: "bg-blue-600 hover:bg-blue-700",
  },
};

// Constantes para el avatar
export const AVATAR_COLOR_SCHEMES = {
  default: "bg-gray-300 text-gray-700",
  primary: "bg-blue-500 text-white",
  danger: "bg-red-500 text-white",
  success: "bg-green-500 text-white",
  warning: "bg-yellow-500 text-white",
  info: "bg-teal-500 text-white",
  gradient: "bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 text-white", // Soporte para CandidateCard
};

export const AVATAR_SIZE_CLASSES = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-xl",
  full: "w-full h-full text-4xl", // Soporte para CandidateCard
};

export const AVATAR_HOVER_EFFECTS_CLASS = "hover:scale-105 transition-transform duration-200";

export const AVATAR_CONSTANTS = {
  DEFAULTS: {
    SIZE: 'md',
    COLOR_SCHEME: 'default',
    WITH_BORDER: false,
    WITH_HOVER_EFFECTS: true,
  },
  SIZE_CLASSES: AVATAR_SIZE_CLASSES,
  COLOR_SCHEMES: AVATAR_COLOR_SCHEMES,
  HOVER_EFFECTS: {
    ENABLED: AVATAR_HOVER_EFFECTS_CLASS,
  },
};