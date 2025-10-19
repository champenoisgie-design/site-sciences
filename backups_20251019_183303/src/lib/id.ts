export function genId(prefix = ""): string {
  return (prefix ? prefix + "_" : "") +
    Math.random().toString(36).slice(2) +
    Date.now().toString(36);
}
