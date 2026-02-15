/** @format */

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    ChevronDown,
    Shield,
    Crown,
    Briefcase,
    User as UserIcon,
    type LucideIcon,
} from "lucide-react";

type RoleValue = "admin" | "manager" | "employee" | (string & {});
type RoleOption = { value: RoleValue; label: string; icon: LucideIcon };

const ROLE_OPTIONS: RoleOption[] = [
    { value: "admin", label: "Admin", icon: Crown },
    { value: "manager", label: "Manager", icon: Briefcase },
    { value: "employee", label: "Employee", icon: UserIcon },
];

type CustomRoleSelectProps = {
    value: RoleValue;
    onChange: (value: RoleValue) => void;
    disabled?: boolean;
    error?: string;
};

type Pos = { top: number; left: number; width: number };

export default function CustomRoleSelect({
    value,
    onChange,
    disabled = false,
    error,
}: CustomRoleSelectProps) {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState<Pos | null>(null);

    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);

    const current = useMemo(() => {
        return ROLE_OPTIONS.find((r) => r.value === value) || ROLE_OPTIONS[2];
    }, [value]);

    const CurrentIcon = current.icon;

    const computePos = () => {
        const btn = triggerRef.current;
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        setPos({
            top: rect.bottom + 12, // mt-3 = 12px
            left: rect.left,
            width: rect.width,
        });
    };

    // Open + compute position
    const toggleOpen = () => {
        if (disabled) return;
        setOpen((v) => {
            const next = !v;
            if (next) {
                // compute on next frame for accurate layout
                requestAnimationFrame(computePos);
            }
            return next;
        });
    };

    // Keep aligned on scroll / resize while open
    useEffect(() => {
        if (!open) return;

        const onReflow = () => computePos();
        window.addEventListener("resize", onReflow);
        window.addEventListener("scroll", onReflow, true); // capture scroll in containers too

        return () => {
            window.removeEventListener("resize", onReflow);
            window.removeEventListener("scroll", onReflow, true);
        };
    }, [open]);

    // Close on outside click (works even with portal)
    useEffect(() => {
        if (!open) return;

        const onPointerDown = (e: PointerEvent) => {
            const t = e.target as Node;
            const btn = triggerRef.current;
            const panel = panelRef.current;

            if (btn && btn.contains(t)) return;
            if (panel && panel.contains(t)) return;

            setOpen(false);
        };

        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [open]);

    // Close on ESC
    useEffect(() => {
        if (!open) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    const dropdown =
        open && pos
            ? createPortal(
                  <div
                      ref={panelRef}
                      style={{
                          position: "fixed",
                          top: pos.top,
                          left: pos.left,
                          width: pos.width,
                          zIndex: 100000, // above modal
                      }}
                      className='
              rounded-2xl overflow-hidden
              bg-white dark:bg-[#0B1120]
              border border-black/10 dark:border-white/10
              shadow-[0_25px_60px_-20px_rgba(0,0,0,0.45)]
            '
                      role='listbox'
                  >
                      <div className='p-2'>
                          {ROLE_OPTIONS.map((opt) => {
                              const Icon = opt.icon;
                              const active = opt.value === value;

                              return (
                                  <button
                                      key={String(opt.value)}
                                      type='button'
                                      onClick={() => {
                                          onChange(opt.value);
                                          setOpen(false);
                                      }}
                                      className={`
                      w-full flex items-center gap-3
                      px-3 py-3 rounded-xl
                      transition-all duration-200 text-left
                      ${
                          active
                              ? "bg-amber-600/10 border border-amber-600/20"
                              : "hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
                      }
                    `}
                                  >
                                      <span
                                          className={`
                        inline-flex items-center justify-center w-10 h-10 rounded-xl
                        border
                        ${
                            active
                                ? "bg-amber-600/15 border-amber-600/25"
                                : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10"
                        }
                      `}
                                      >
                                          <Icon
                                              size={18}
                                              className={
                                                  active
                                                      ? "text-amber-600"
                                                      : "text-slate-500"
                                              }
                                          />
                                      </span>

                                      <div className='flex-1'>
                                          <div className='font-extrabold uppercase italic tracking-tight dark:text-white text-gray-800'>
                                              {opt.label}
                                          </div>
                                          <div className='text-[10px] uppercase tracking-[0.22em] font-black text-slate-500 dark:text-slate-400'>
                                              {String(opt.value)}
                                          </div>
                                      </div>

                                      {active ? (
                                          <span className='text-[9px] font-black uppercase tracking-[0.22em] text-amber-600'>
                                              Selected
                                          </span>
                                      ) : null}
                                  </button>
                              );
                          })}
                      </div>
                  </div>,
                  document.body,
              )
            : null;

    return (
        <div className='relative'>
            {/* Trigger */}
            <button
                ref={triggerRef}
                type='button'
                disabled={disabled}
                onClick={toggleOpen}
                className={`
          w-full h-14 rounded-2xl px-4 pl-12 pr-12
          flex items-center justify-between
          bg-black/5 dark:bg-white/5
          border border-black/10 dark:border-white/10
          text-gray-900 dark:text-white text-sm
          transition-all duration-300
          hover:bg-black/8 dark:hover:bg-white/8
          focus:outline-none
          ${open ? "border-amber-600/50 ring-2 ring-amber-600/15" : "focus:border-amber-600/50"}
          ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
        `}
                aria-haspopup='listbox'
                aria-expanded={open}
            >
                <div className='flex items-center gap-3'>
                    <span className='inline-flex items-center justify-center w-8 h-8 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10'>
                        <CurrentIcon size={16} className='text-amber-600/80' />
                    </span>

                    <div className='flex flex-col items-start leading-none'>
                        <span className='text-[10px] uppercase tracking-[0.25em] font-black text-slate-500 dark:text-slate-400'>
                            Role
                        </span>
                        <span className='font-extrabold uppercase italic tracking-tight'>
                            {current.label}
                        </span>
                    </div>
                </div>

                <ChevronDown
                    size={18}
                    className={`text-slate-500 transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Shield icon */}
            <Shield
                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none'
                size={18}
            />

            {/* Error badge */}
            {error ? (
                <span className='absolute right-12 top-1/2 -translate-y-1/2 text-[9px] text-rose-500 font-black uppercase'>
                    {error}
                </span>
            ) : null}

            {/* Portal dropdown */}
            {dropdown}
        </div>
    );
}
