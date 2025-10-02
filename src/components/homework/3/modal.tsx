"use client";

import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children?: React.ReactNode;
}

const Modal = ({ open, title, onClose, children }: ModalProps) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      <div
        className="max-h-[70vh] w-[60%] min-w-80 max-w-[90vw] overflow-y-auto bg-neutral-800 text-white p-8 rounded-2xl shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {title && <h3 className="mt-0 mb-4 text-xl font-semibold">{title}</h3>}
        {children}
        <button
          onClick={onClose}
          className="mt-8 px-5 py-2 rounded-lg border-none bg-cyan-400 text-neutral-800 font-bold cursor-pointer hover:bg-cyan-300 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
