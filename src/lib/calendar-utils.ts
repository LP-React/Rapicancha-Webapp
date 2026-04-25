// src/lib/calendar-utils.ts

/**
 * CONFIGURACIÓN DEL CALENDARIO
 * Puedes ajustar estas constantes para cambiar el rango horario
 * o la altura visual de las celdas.
 */
export const START_HOUR = 7; // Inicio: 7:00 AM
export const END_HOUR = 23; // Fin: 11:00 PM
export const HOUR_HEIGHT = 100; // Pixeles por cada hora (h-24 approx)

export const DAYS = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"];

export const HOURS = Array.from(
  { length: END_HOUR - START_HOUR + 1 },
  (_, i) => i + START_HOUR,
);

/**
 * CÁLCULO DE POSICIONES
 * Convierte horas (HH:mm:ss) en coordenadas de pixeles (top y height)
 */
export const calculatePosition = (startTime: string, endTime: string) => {
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  // Minutos desde el inicio del calendario (START_HOUR)
  const startTotalMinutes = (startH - START_HOUR) * 60 + startM;

  // Duración total en minutos
  const durationMinutes = endH * 60 + endM - (startH * 60 + startM);

  return {
    top: (startTotalMinutes / 60) * HOUR_HEIGHT,
    height: (durationMinutes / 60) * HOUR_HEIGHT,
  };
};

/**
 * LÓGICA DE FECHAS PARA PAGINACIÓN
 */

/**
 * Obtiene el lunes de la semana de una fecha dada.
 * Ajusta el desfase de getDay() donde Domingo es 0.
 */
export const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  // Si es domingo (0), retrocedemos 6 días para llegar al lunes.
  // Si no, retrocedemos (day - 1) días.
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

/**
 * Devuelve un array de objetos con la información de los 7 días
 * de la semana empezando desde startOfWeek.
 */
export const getWeekDays = (startOfWeek: Date) => {
  return DAYS.map((name, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return {
      name,
      date: date,
      dayNumber: date.getDate(),
      isToday: date.toDateString() === new Date().toDateString(),
    };
  });
};

/**
 * Formatea el rango de la semana para el header (Ej: "20 Abr — 26 Abr")
 */
export const formatWeekRange = (startOfWeek: Date) => {
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  const startStr = startOfWeek.toLocaleDateString("es-ES", options);
  const endStr = endOfWeek.toLocaleDateString("es-ES", options);

  // Capitalizar mes (opcional)
  return `${startStr} — ${endStr}`;
};

/**
 * Determina el índice de la columna (0-6) para una fecha de la API.
 * Importante: Se añade "T00:00:00" para evitar errores de zona horaria.
 */
export const getColumnIndex = (dateString: string) => {
  const date = new Date(dateString + "T00:00:00");
  const day = date.getDay(); // 0 = Domingo, 1 = Lunes...
  return day === 0 ? 6 : day - 1; // Retorna 0 para Lunes, 6 para Domingo
};
