export const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let counter = 1000;
export const nextId = (prefix: string) => `${prefix}-${++counter}`;

export const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(" ");

export const nowStamp = () =>
  new Date().toLocaleString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
