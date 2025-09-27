export function safeStringify(v: any) { try { return JSON.stringify(v) } catch { return '[]' } }
