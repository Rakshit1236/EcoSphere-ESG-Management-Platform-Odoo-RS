export function cn(...c: (string | boolean | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}
