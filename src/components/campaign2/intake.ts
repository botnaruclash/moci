// moci-web: the landing form's values and checks. Three essentials — the business, its services, a phone number —
// and two optional fields.

import { campaign } from "@/content/campaign2";

export type Values = {
  business: string;
  services: string;
  presence: string;
  phone: string;
  details: string;
};

export type Field = "business" | "services" | "phone";

export const emptyValues: Values = { business: "", services: "", presence: "", phone: "", details: "" };

/** A phone number people actually type: digits with spaces, dashes, dots or brackets, an optional leading +, and
 *  8–15 digits (a Moldovan number is 8 after the 0 or +373). */
export function phoneValid(phone: string) {
  const trimmed = phone.trim();
  if (!/^\+?[\d\s().-]+$/.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "").length;
  return digits >= 8 && digits <= 15;
}

export function validate(v: Values): Partial<Record<Field, string>> {
  const { errors } = campaign.form;
  const found: Partial<Record<Field, string>> = {};
  if (v.business.trim().length < 2) found.business = errors.business;
  if (v.services.trim().length < 3) found.services = errors.services;
  if (!phoneValid(v.phone)) found.phone = errors.phone;
  return found;
}
