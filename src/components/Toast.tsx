"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

export default function Toast({ message, visible, onClose }: ToastProps) {
  useEffect(() =>{
    if (visible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }    return undefined;  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-slideDown">
      <div className="bg-black text-white px-6 py-4 rounded shadow-lg flex items-center gap-3">
        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
          ✓
        </div>
        <span className="text-sm font-light">{message}</span>
      </div>
    </div>
  );
}
