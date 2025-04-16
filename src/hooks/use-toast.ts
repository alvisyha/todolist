// src/hooks/use-toast.ts
import { useState, useCallback } from "react";

type Toast = {
  id: string;
  title: string;
  description?: string; // Deskripsi dapat bersifat opsional
  action?: string; // Action juga bersifat opsional
  type: "success" | "error" | "info" | "warning";
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (
      title: string,
      type: Toast["type"],
      description?: string,
      action?: string
    ) => {
      const id = new Date().toISOString();
      const newToast: Toast = { id, title, description, action, type };

      setToasts((prevToasts) => [...prevToasts, newToast]);

      // Hapus toast setelah 5 detik
      setTimeout(() => {
        setToasts((prevToasts) =>
          prevToasts.filter((toast) => toast.id !== id)
        );
      }, 5000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
  };
};
