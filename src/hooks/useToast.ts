import { useState, useCallback } from 'react';
import { ToastProps, ToastType } from '@/components/ui/Toast';

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((
    type: ToastType,
    message: string,
    description?: string,
    duration?: number
  ) => {
    const id = `toast-${toastId++}`;
    const newToast: ToastProps = {
      id,
      type,
      message,
      description,
      duration,
      onClose: (id: string) => removeToast(id),
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message: string, description?: string, duration?: number) => {
    return addToast('success', message, description, duration);
  }, [addToast]);

  const error = useCallback((message: string, description?: string, duration?: number) => {
    return addToast('error', message, description, duration);
  }, [addToast]);

  const warning = useCallback((message: string, description?: string, duration?: number) => {
    return addToast('warning', message, description, duration);
  }, [addToast]);

  const info = useCallback((message: string, description?: string, duration?: number) => {
    return addToast('info', message, description, duration);
  }, [addToast]);

  return {
    toasts,
    success,
    error,
    warning,
    info,
    removeToast,
  };
}
