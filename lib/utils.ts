import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  const year: number = date.getFullYear();
  const month: number = date.getMonth() + 1; // getMonth() returns 0-based month
  const day: number = date.getDate();

  // Pad single digit month and day with leading zeros
  const monthString: string = month < 10 ? `0${month}` : `${month}`;
  const dayString: string = day < 10 ? `0${day}` : `${day}`;

  return `${year}-${monthString}-${dayString}`;
}
