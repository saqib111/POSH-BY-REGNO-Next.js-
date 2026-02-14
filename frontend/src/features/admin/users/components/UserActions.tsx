/** @format */

"use client";

import React, { useState } from "react";
import { KeyRound, Pencil, Trash2, MoreVertical } from "lucide-react";

export default function UserActions({
    onEditClick,
    onPasswordClick,
    onDeleteClick,
    disableActions,
}: {
    onEditClick: () => void;
    onPasswordClick: () => void;
    onDeleteClick: () => void;
    disableActions?: boolean;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className='relative inline-flex justify-end'>
            <button
                type='button'
                onClick={() => setOpen((v) => !v)}
                disabled={disableActions}
                className='
          inline-flex items-center justify-center
          h-11 w-11 rounded-2xl
          border border-slate-200 bg-white text-slate-700
          dark:border-slate-700 dark:bg-slate-900/40 dark:text-white
          shadow-sm transition-all
          hover:border-amber-600 hover:text-amber-600
          disabled:opacity-30 disabled:cursor-not-allowed
        '
            >
                <MoreVertical size={18} />
            </button>

            {open && (
                <>
                    <button
                        type='button'
                        className='fixed inset-0 z-40 cursor-default'
                        onClick={() => setOpen(false)}
                    />
                    <div
                        className='
              absolute right-0 top-12 z-50 w-52
              rounded-3xl border border-slate-200 bg-white/90 backdrop-blur
              dark:border-slate-700 dark:bg-slate-900/80
              shadow-2xl overflow-hidden
            '
                    >
                        <ActionItem
                            icon={<Pencil size={16} />}
                            label='Edit User'
                            onClick={() => {
                                setOpen(false);
                                onEditClick();
                            }}
                        />
                        <ActionItem
                            icon={<KeyRound size={16} />}
                            label='Update Password'
                            onClick={() => {
                                setOpen(false);
                                onPasswordClick();
                            }}
                        />
                        <div className='h-px bg-slate-200/60 dark:bg-slate-700/60' />
                        <ActionItem
                            icon={<Trash2 size={16} />}
                            label='Delete'
                            danger
                            onClick={() => {
                                setOpen(false);
                                onDeleteClick();
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

function ActionItem({
    icon,
    label,
    onClick,
    danger,
}: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    danger?: boolean;
}) {
    return (
        <button
            type='button'
            onClick={onClick}
            className={[
                "w-full px-5 py-4 flex items-center gap-3",
                "text-[10px] font-black uppercase tracking-[0.22em]",
                "transition-all",
                danger
                    ? "text-rose-700 hover:bg-rose-500/10 dark:text-rose-200"
                    : "text-slate-700 hover:bg-amber-500/10 dark:text-slate-200",
            ].join(" ")}
        >
            <span className={danger ? "text-rose-600" : "text-amber-600"}>
                {icon}
            </span>
            <span className='text-left'>{label}</span>
        </button>
    );
}
