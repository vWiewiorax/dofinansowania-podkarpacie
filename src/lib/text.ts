export function clean(value: string | undefined | null): string {
  return (value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l");
}

export function parsePlDate(value: string | undefined): string | undefined {
  const m = value?.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (!m) return undefined;
  const [, d, mo, y] = m;
  return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

export function isFreeText(value: string): boolean {
  return /bezpłatn|nieodpłatn|darmow|bez opłat/i.test(value);
}

export function absoluteUrl(href: string, base: string): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}
