import { genId } from "./id";

export function withMeta<T extends Record<string, any>>(data: T, prefix = ""): T & { id: string; updatedAt: Date } {
  return {
    id: data.id ?? genId(prefix),
    updatedAt: data.updatedAt ?? new Date(),
    ...data,
  };
}
