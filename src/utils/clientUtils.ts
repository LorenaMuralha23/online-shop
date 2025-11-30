export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
}

export function generatePastDate() {
  const now = new Date();
  const past = new Date();

  const maxYears = 5;
  const randomYears = Math.floor(Math.random() * maxYears);
  const randomDays = Math.floor(Math.random() * 365);

  past.setFullYear(now.getFullYear() - randomYears);
  past.setDate(now.getDate() - randomDays);

  return past.toISOString();
}

export function randomStatus() {
  return Math.random() > 0.5 ? "activated" : "deactivated";
}
