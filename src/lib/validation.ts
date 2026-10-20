export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
export const isPhone = (s: string) => /^[\d\s\-+().]{7,20}$/.test(s.trim());
export const isZip = (s: string) => /^\d{5}(-\d{4})?$/.test(s.trim());

export type ContactForm = { name: string; email: string; phone: string; subject: string; message: string };
export function validateContact(f: ContactForm) {
  const e: Partial<Record<keyof ContactForm, string>> = {};
  if (!f.name.trim()) e.name = "Full name is required";
  if (!f.email.trim()) e.email = "Email is required"; else if (!isEmail(f.email)) e.email = "Invalid email address";
  if (!f.phone.trim()) e.phone = "Phone is required"; else if (!isPhone(f.phone)) e.phone = "Invalid phone number";
  if (!f.subject.trim()) e.subject = "Subject is required";
  if (!f.message.trim()) e.message = "Message is required";
  return e;
}

export type JoinForm = { firstName: string; lastName: string; email: string; phone: string; zip: string; interests: string[]; message: string };
export function validateJoin(f: JoinForm) {
  const e: Partial<Record<keyof JoinForm, string>> = {};
  if (!f.firstName.trim()) e.firstName = "First name is required";
  if (!f.lastName.trim()) e.lastName = "Last name is required";
  if (!f.email.trim()) e.email = "Email is required"; else if (!isEmail(f.email)) e.email = "Invalid email address";
  if (f.phone.trim() && !isPhone(f.phone)) e.phone = "Invalid phone number";
  if (!f.zip.trim()) e.zip = "ZIP code is required"; else if (!isZip(f.zip)) e.zip = "Invalid ZIP code";
  if (f.interests.length === 0) e.interests = "Select at least one area of interest";
  return e;
}
