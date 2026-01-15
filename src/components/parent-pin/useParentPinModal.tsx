"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ParentPinModal } from "@/components/parent-pin/ParentPinModal";

/**
 * Hook "open(): Promise<void>" basé sur TON composant ParentPinModal
 * - ParentPinModal fait le POST /api/parent-pin/verify
 * - on résout la Promise quand onVerified est appelé (PIN OK)
 */
export function useParentPinModal() {
  const [openState, setOpenState] = useState(false);
  const resolverRef = useRef<null | (() => void)>(null);

  const open = useCallback(() => {
    setOpenState(true);
    return new Promise<void>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const close = useCallback(() => {
    setOpenState(false);
    resolverRef.current = null;
  }, []);

  const onVerified = useCallback(() => {
    setOpenState(false);
    resolverRef.current?.();
    resolverRef.current = null;
  }, []);

  const Modal = useMemo(() => {
    if (!openState) return null;
    return (
      <ParentPinModal
        open={openState}
        onClose={close}
        onVerified={onVerified}
      />
    );
  }, [openState, close, onVerified]);

  return { open, ParentPinModal: Modal };
}
