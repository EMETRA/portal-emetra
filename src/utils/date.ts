export function formatFullDate(dateString: string, locale = "es-ES"): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return dateString;
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat(locale, dateOptions).format(
    date
  );
  const formattedTime = new Intl.DateTimeFormat(locale, timeOptions).format(
    date
  );

  return `${formattedDate} a las ${formattedTime}`;
}
