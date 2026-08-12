{/* --- Función auxiliar para formatear minutos a HH:MM --- */ }

const minToTime = (min: number | null) => {
  if (min === null) return "--:--";
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
};

export default minToTime;
