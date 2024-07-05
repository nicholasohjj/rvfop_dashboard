export const formatSGT = (utcString) => {
  const utcDate = new Date(utcString);
  // Convert UTC date to SGT (UTC+8)
  const sgtDate = new Date(utcDate.getTime() + 8 * 60 * 60 * 1000);
  // Format date to "day-month" using Intl.DateTimeFormat
  return new Intl.DateTimeFormat("en-SG", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(sgtDate);
};

export const isNewDay = (currentMessageDate, previousMessageDate) => {
  const currentDate = new Date(currentMessageDate).setHours(0, 0, 0, 0);
  const previousDate = new Date(previousMessageDate).setHours(0, 0, 0, 0);
  return currentDate > previousDate;
};
