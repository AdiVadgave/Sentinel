export const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let seq = 0;
export const nextId = (prefix: string) => {
  // A 6-digit time component (changes every second and survives page reloads)
  // plus an in-session sequence, so generated IDs never collide across reloads.
  // The old counter reset to 1000 on every reload, which — now that work items
  // persist to the backend — caused new reports to clash with an existing ID
  // and be silently dropped by the de-dupe on save.
  seq += 1;
  const base = String(Math.floor(Date.now() / 1000) % 1_000_000).padStart(6, "0");
  return `${prefix}-${base}${seq}`;
};

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
