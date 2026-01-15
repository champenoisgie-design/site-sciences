"use client";

import React from "react";
import { useParentPinModal } from "@/components/parent-pin/useParentPinModal";

/**
 * Force le PIN à chaque arrivée sur une page.
 * Cache les children tant que le PIN n'a pas été validé.
 */
export function RequireParentPinAlways({ children }: { children: React.ReactNode }) {
  const { open, ParentPinModal } = useParentPinModal();
  const [ok, setOk] = React.useState(false);

  React.useEffect(() => {
    let alive = true;

    (async () => {
      await open();          // ouvre le modal, résout quand PIN OK
      if (alive) setOk(true);
    })();

    return () => {
      alive = false;
    };
  }, [open]);

  return (
    <>
      {ok ? children : null}
      {ParentPinModal}
    </>
  );
}
