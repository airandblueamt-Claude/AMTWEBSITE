// Strip stray wrapping quotes and trailing newlines that exist in the CMS data
// (many fields were authored like `"ICT Solutions"` or `...finish.\n`).
const cleanStr = (s) => {
  if (typeof s !== "string") return s;
  let t = s.replace(/\r/g, "").trim();
  // Remove one or more layers of matching wrapping straight quotes.
  while (
    t.length >= 2 &&
    ((t[0] === '"' && t[t.length - 1] === '"') ||
      (t[0] === "'" && t[t.length - 1] === "'") ||
      (t[0] === "“" && t[t.length - 1] === "”"))
  ) {
    t = t.slice(1, -1).trim();
  }
  return t;
};

export const localize = (field, lang) => {
  if (!field) return "";
  if (typeof field === "string" || typeof field === "number") return cleanStr(String(field));
  if (Array.isArray(field)) return field;
  if (typeof field === "object") {
    return cleanStr(field[lang] || field.en || field.ar || "");
  }
  return cleanStr(String(field));
};
