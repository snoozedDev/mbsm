import moment from "moment";

export const calculateRelativeDate = (date: string): string => {
  const ref = moment(date);
  const now = moment();

  if (now.isSameOrBefore(ref)) return "now";
  const seconds = now.diff(ref, "seconds");
  if (seconds < 5) return "now";
  if (seconds <= 59) return `${seconds} seconds ago`;
  const minutes = now.diff(ref, "minutes");
  if (minutes <= 59) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = now.diff(ref, "hours");
  if (hours <= 23) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = now.diff(ref, "days");
  if (days <= 5) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (now.isSame(ref, "year")) return ref.format("MMM Mo");
  return ref.format("L");
};
