/** @format */

"use client";

import React from "react";
import type { UserRole } from "../types";

const roleStyles: Record<string, string> = {
    superadmin:
        "bg-amber-600/10 text-amber-700 border-amber-600/20 dark:bg-amber-600/10 dark:text-amber-200 dark:border-amber-600/20",
    admin: "bg-slate-900/10 text-slate-900 border-slate-900/20 dark:bg-white/10 dark:text-white dark:border-white/10",
    manager:
        "bg-indigo-600/10 text-indigo-700 border-indigo-600/20 dark:bg-indigo-600/10 dark:text-indigo-200 dark:border-indigo-600/20",
    employee:
        "bg-emerald-600/10 text-emerald-700 border-emerald-600/20 dark:bg-emerald-600/10 dark:text-emerald-200 dark:border-emerald-600/20",
    customer:
        "bg-pink-600/10 text-pink-700 border-pink-600/20 dark:bg-pink-600/10 dark:text-pink-200 dark:border-pink-600/20",
};

export default function RoleBadge({ role }: { role: UserRole }) {
    const r = String(role || "user").toLowerCase();
    const cls =
        roleStyles[r] ||
        "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-200 dark:border-slate-700";

    return (
        <span
            className={[
                "inline-flex items-center justify-center",
                "px-3 py-1.5 rounded-2xl border",
                "text-[10px] font-black uppercase tracking-[0.22em]",
                cls,
            ].join(" ")}
        >
            {r}
        </span>
    );
}
