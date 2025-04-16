// src/components/Toaster.tsx
"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, type }) => {
        // Tentukan kelas berdasarkan tipe toast
        let toastTypeClass = "";
        switch (type) {
          case "success":
            toastTypeClass = "bg-green-500 text-white"; // Sesuaikan dengan desain
            break;
          case "error":
            toastTypeClass = "bg-red-500 text-white"; // Sesuaikan dengan desain
            break;
          case "info":
            toastTypeClass = "bg-blue-500 text-white"; // Sesuaikan dengan desain
            break;
          case "warning":
            toastTypeClass = "bg-yellow-500 text-white"; // Sesuaikan dengan desain
            break;
        }

        return (
          <Toast key={id} className={toastTypeClass}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action && <div>{action}</div>} {/* Tampilkan action jika ada */}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
