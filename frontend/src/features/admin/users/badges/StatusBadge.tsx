/** @format */
"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import type { UserStatus } from "../types";

export default function StatusBadge({
    status,
    loading,
    onToggle,
}: {
    status: UserStatus;
    loading?: boolean;
    onToggle?: () => void;
}) {
    const s = String(status || "active").toLowerCase();
    const isActive = s === "active";

    return (
        <button
            type='button'
            onClick={onToggle}
            disabled={loading}
            className={[
                "inline-flex items-center gap-2",
                "px-4 py-2 rounded-2xl border",
                "text-[10px] font-black uppercase tracking-[0.22em]",
                "transition-all shadow-sm",
                loading
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:-translate-y-px",
                isActive
                    ? "bg-emerald-600/10 text-emerald-700 border-emerald-600/20 dark:bg-emerald-600/10 dark:text-emerald-200 dark:border-emerald-600/20"
                    : "bg-rose-600/10 text-rose-700 border-rose-600/20 dark:bg-rose-600/10 dark:text-rose-200 dark:border-rose-600/20",
            ].join(" ")}
        >
            {loading ? <Loader2 className='animate-spin' size={14} /> : null}
            {isActive ? "active" : "suspended"}
        </button>
    );
}
