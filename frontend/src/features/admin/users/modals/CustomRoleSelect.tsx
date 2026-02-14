/** @format */

"use client";

/** @format */

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    ChevronDown,
    Shield,
    Crown,
    Briefcase,
    User as UserIcon,
    type LucideIcon,
} from "lucide-react";

type RoleValue = "admin" | "manager" | "employee" | string;

type RoleOption = {
    value: RoleValue;
    label: string;
    icon: LucideIcon;
};

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

export default function CustomRoleSelect({
    value,
    onChange,
    disabled = false,
    error,
}: CustomRoleSelectProps) {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef<HTMLDivElement | null>(null);

    const current = useMemo(() => {
        return ROLE_OPTIONS.find((r) => r.value === value) || ROLE_OPTIONS[2];
    }, [value]);

    const CurrentIcon = current.icon;

    // Close on outside click
    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!open) return;
            const el = wrapRef.current;
            if (!el) return;
            if (!el.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [open]);

    // Close on ESC
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (!open) return;
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <div className='relative' ref={wrapRef}>
            {/* Trigger */}
            <button
                type='button'
                disabled={disabled}
                onClick={() => setOpen((v) => !v)}
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
                {/* Left: icon + label */}
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

                {/* Chevron */}
                <ChevronDown
                    size={18}
                    className={`text-slate-500 transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Left shield icon like your inputs */}
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

            {/* Dropdown */}
            {open && !disabled ? (
                <div
                    className='
            absolute left-0 right-0 mt-3 z-99999
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
                </div>
            ) : null}
        </div>
    );
}
