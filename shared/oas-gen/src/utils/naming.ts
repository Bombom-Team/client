export const toKebab = (s: string) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

export const toCamel = (s: string) => {
  const kebab = toKebab(s);
  return kebab.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
};

export const toLowerCamel = (s: string) => {
  const camel = toCamel(s);
  return camel.charAt(0).toLowerCase() + camel.slice(1);
};
