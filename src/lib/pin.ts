import bcrypt from "bcryptjs";

export function assertPinFormat(pin: string) {
  if (!/^\d{4}$/.test(pin)) throw new Error("PIN invalide (4 chiffres requis)");
}

export async function hashPin(pin: string) {
  assertPinFormat(pin);
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(pin, salt);
}

export async function verifyPin(pin: string, hash: string) {
  assertPinFormat(pin);
  return bcrypt.compare(pin, hash);
}
