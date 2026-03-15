/** @format */

"use client";

import React, { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

let __modalLockCount = 0;

type ModalShellProps = {
    open: boolean;
    title: string;
    subtitle?: string;
    onClose: () => void;
    children: React.ReactNode;
    /** optional: if you want to control stacking */
    zIndex?: number;
};

export default function ModalShell({
    open,
    title,
    subtitle,
    onClose,
    children,
    zIndex = 9999,
}: ModalShellProps) {
    const portalTarget = useMemo(() => {
        if (typeof document === "undefined") return null;
        return document.body;
    }, []);

    // Body scroll lock + ESC close (safe for nested modals)
    useEffect(() => {
        if (!open) return;

        const prevOverflow = document.body.style.overflow;

        __modalLockCount += 1;
        if (__modalLockCount === 1) {
            document.body.style.overflow = "hidden";
        }

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);

        return () => {
            window.removeEventListener("keydown", onKey);

            __modalLockCount = Math.max(0, __modalLockCount - 1);
            if (__modalLockCount === 0) {
                document.body.style.overflow = prevOverflow;
            }
        };
    }, [open, onClose]);

    if (!open || !portalTarget) return null;

    return createPortal(
        <div className='fixed inset-0' style={{ zIndex }}>
            {/* Overlay */}
            <button
                type='button'
                onClick={onClose}
                className='absolute inset-0 bg-black/40 backdrop-blur-[2px]'
                aria-label='Close modal overlay'
            />

            {/* Dialog */}
            <div className='absolute inset-0 flex items-center justify-center p-4'>
                <div
                    className='
            relative w-full max-w-xl
            rounded-4xl
            border border-slate-200 bg-white/90 backdrop-blur
            dark:border-slate-800 dark:bg-slate-950/70
            shadow-2xl overflow-hidden
          '
                    onClick={(e) => e.stopPropagation()}
                    role='dialog'
                    aria-modal='true'
                    aria-label={title}
                >
                    {/* Header */}
                    <div className='relative px-8 pt-8 pb-6 border-b border-slate-200/60 dark:border-slate-800/60'>
                        {/* Accent line aligned with content */}
                        <div
                            className='
                absolute top-0 left-8 right-8 h-1.5 rounded-full
                bg-linear-to-r from-amber-600/60 via-amber-600/20 to-transparent
              '
                        />

                        <div className='flex items-start justify-between gap-4'>
                            <div>
                                <h3 className='text-xl font-black tracking-tight text-slate-900 dark:text-white'>
                                    {title}
                                </h3>
                                {subtitle ? (
                                    <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
                                        {subtitle}
                                    </p>
                                ) : null}
                            </div>

                            <button
                                type='button'
                                onClick={onClose}
                                className='
                  h-11 w-11 rounded-2xl
                  border border-slate-200 bg-white text-slate-700
                  dark:border-slate-800 dark:bg-slate-900/40 dark:text-white
                  hover:border-amber-600 hover:text-amber-600 transition-all
                  flex items-center justify-center
                '
                                aria-label='Close modal'
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className='p-8'>{children}</div>
                </div>
            </div>
        </div>,
        portalTarget,
    );
}
