import { DateValue } from "@heroui/react";

export function formatDateForDatepicker(date: DateValue): string {
  if (date) {
    const day: string = date.day < 10 ? `0${date.day}` : date.day.toString();
    const month: string =
      date.month < 10 ? `0${date.month}` : date.month.toString();
    const year: string = date.year.toString();

    const elabDate: string = `${year}-${month}-${day}`;

    return elabDate;
  } else return "";
}
