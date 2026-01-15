"use client";

async function isPinRequired(res: Response): Promise<boolean> {
  if (res.status === 423) return true;

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return false;

  try {
    const data = await res.clone().json();
    return data?.error === "PARENT_PIN_REQUIRED" || data?.code === "PARENT_PIN_REQUIRED";
  } catch {
    return false;
  }
}

export async function fetchWithParentPinRetry(
  input: RequestInfo,
  init: RequestInit | undefined,
  openPin: () => Promise<void>,
) {
  const res1 = await fetch(input, init);
  if (!(await isPinRequired(res1))) return res1;

  await openPin();         // demande PIN (modal)
  return fetch(input, init); // retry
}
