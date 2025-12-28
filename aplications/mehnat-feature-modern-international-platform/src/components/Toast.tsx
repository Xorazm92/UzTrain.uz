import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'border-green-500/20 bg-green-500/10';
      case 'error':
        return 'border-red-500/20 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/10';
      case 'info':
        return 'border-blue-500/20 bg-blue-500/10';
    }
  };

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 max-w-sm w-full transition-all duration-300",
      isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
    )}>
      <div className={cn(
        "railway-card border p-4 shadow-lg",
        getStyles()
      )}>
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white">{title}</h4>
            {message && (
              <p className="text-sm text-gray-300 mt-1">{message}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast Manager
class ToastManager {
  private toasts: ToastProps[] = [];
  private listeners: ((toasts: ToastProps[]) => void)[] = [];

  subscribe(listener: (toasts: ToastProps[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }

  show(toast: Omit<ToastProps, 'id' | 'onClose'>) {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: this.remove.bind(this)
    };
    
    this.toasts.push(newToast);
    this.notify();
    
    return id;
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notify();
  }

  clear() {
    this.toasts = [];
    this.notify();
  }
}

export const toastManager = new ToastManager();

// Toast Container Component
export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    return toastManager.subscribe(setToasts);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

// Helper functions
export const toast = {
  success: (title: string, message?: string) => 
    toastManager.show({ type: 'success', title, message }),
  
  error: (title: string, message?: string) => 
    toastManager.show({ type: 'error', title, message }),
  
  warning: (title: string, message?: string) => 
    toastManager.show({ type: 'warning', title, message }),
  
  info: (title: string, message?: string) => 
    toastManager.show({ type: 'info', title, message })
};
