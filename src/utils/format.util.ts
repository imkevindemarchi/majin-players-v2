import { DateValue } from "@heroui/react";

export function formatDateFromDb(date: DateValue): string {
  if (date) {
    const day: string = date.day < 10 ? `0${date.day}` : date.day.toString();
    const month: string =
      date.month < 10 ? `0${date.month}` : date.month.toString();
    const year: string = date.year.toString();

    return `${day}/${month}/${year}`;
  } else return "";
}
