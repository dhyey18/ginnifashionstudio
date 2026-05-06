"use client";

import { CheckCircle, WarningCircle, Info, X } from "@phosphor-icons/react";
import { useStore } from "@/lib/store";

export function ToastNotification() {
  const { toast, dismissToast } = useStore();

  const ICONS = { success: CheckCircle, error: WarningCircle, info: Info };

  return (
    <div className="g-toast" data-open={!!toast} role="status" aria-live="polite" aria-atomic>
      {toast && (() => {
        const Icon = ICONS[toast.variant];
        return (
          <>
            <Icon size={18} weight="fill" aria-hidden />
            <span>{toast.message}</span>
            <button className="g-icon-btn" onClick={dismissToast} aria-label="Dismiss" style={{ width: 28, height: 28 }}>
              <X size={14} />
            </button>
          </>
        );
      })()}
    </div>
  );
}
