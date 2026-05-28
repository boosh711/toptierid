import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatName(first: string, last: string) {
  return `${first} ${last}`;
}

export function athleteDisplayName(user: { firstName: string; lastName: string }) {
  return formatName(user.firstName, user.lastName);
}
