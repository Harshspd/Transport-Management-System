"use client";
import React, { useRef, useEffect } from "react";

interface SlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export const SlideModal: React.FC<SlideModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {


  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`fixed top-17 right-0 w-1/2 h-full bg-white dark:bg-gray-900 shadow-xl z-50 transition-transform duration-500 ease-in-out`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-thin text-2xl transition-colors">&times;</button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>

  );
};
