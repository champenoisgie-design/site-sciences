"use client";

import * as React from "react";
import { useParentPin } from "@/components/parent-pin/useParentPin";
import { useParentPinModal } from "@/components/parent-pin/useParentPinModal";

export function ParentPinDebugWidget() {
  const { status, refresh } = useParentPin();
  const { open, ParentPinModal } = useParentPinModal();
  const [msg, setMsg] = React.useState<string>("");

  return (
    <div className="fixed bottom-4 right-4 z-[99999] w-[280px] rounded-2xl border bg-white p-3 shadow-xl">
      <div className="text-sm font-semibold">PIN Debug</div>

      <div className="mt-2 text-xs text-gray-700">
        <div>
          status:{" "}
          <span className={status.unlocked ? "font-semibold text-green-600" : "font-semibold text-red-600"}>
            {status.unlocked ? "UNLOCKED" : "LOCKED"}
          </span>
        </div>
        <div className="truncate">
          until: <span className="font-mono">{status.unlockedUntil ?? "-"}</span>
        </div>
      </div>

      {msg ? <div className="mt-2 text-xs text-blue-700">{msg}</div> : null}

      <div className="mt-3 flex gap-2">
        <button
          className="flex-1 rounded-xl border px-3 py-2 text-xs"
          onClick={async () => {
            setMsg("Ouverture modal…");
            await open();
            setMsg("PIN validé. Refresh status…");
            await refresh();
            setTimeout(() => setMsg(""), 1200);
          }}
        >
          Ouvrir PIN
        </button>
        <button
          className="flex-1 rounded-xl border px-3 py-2 text-xs"
          onClick={async () => {
            setMsg("Refresh…");
            await refresh();
            setTimeout(() => setMsg(""), 600);
          }}
        >
          Refresh
        </button>
      </div>

      {ParentPinModal}
    </div>
  );
}
