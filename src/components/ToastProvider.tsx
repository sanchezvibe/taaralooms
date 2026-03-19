"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface Toast {
  id: string;
  title?: string;
  message: string;
  isError?: boolean;
}

interface ToastContextType {
  toast: (message: string, isError?: boolean) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, isError: boolean = false) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, isError, title: "Taaralooms Admin" }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000); // UI Toast lasts for 4 seconds
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className="animate-fade-in-down w-[360px] bg-[#f4f5f8]/95 backdrop-blur-md shadow-lg border border-white/40 rounded-[1.75rem] p-3 flex"
            style={{ 
              animation: 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            {/* iOS Style App Icon */}
            <div className={`w-14 h-14 rounded-[0.9rem] flex shrink-0 items-center justify-center text-white text-[10px] leading-tight font-black uppercase text-center shadow-inner ${t.isError ? 'bg-[#c62828]' : 'bg-[#1b4311]'}`}>
              {t.isError ? (
                <span>Error<br/>Alert</span>
              ) : (
                <span>Taara<br/>Looms</span>
              )}
            </div>

            {/* Content Body */}
            <div className="ml-3 flex-1 flex flex-col justify-center gap-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-medium text-gray-900 tracking-tight">{t.title}</span>
                <span className="text-[13px] text-gray-400 font-medium">just now</span>
              </div>
              <p className="text-[14px] text-gray-800 leading-snug font-medium">
                {t.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
