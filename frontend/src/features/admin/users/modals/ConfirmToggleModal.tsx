/** @format */

"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import ModalShell from "./_ModalShell";
import type { UserStatus } from "../types";

type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    nextStatus: UserStatus;
    isLoading?: boolean;
};

export default function ConfirmToggleModal({
    open,
    onClose,
    onConfirm,
    nextStatus,
    isLoading = false,
}: Props) {
    if (!open) return null;

    const isActive = nextStatus === "active";

    return (
        <ModalShell
            open={open}
            onClose={onClose}
            title='Confirm Status Change'
            subtitle='This will immediately affect user access.'
        >
            <div className='space-y-6'>
                <p className='text-sm text-slate-600 dark:text-slate-300'>
                    Are you sure you want to change the user status to{" "}
                    <span
                        className={`font-black uppercase ${
                            isActive ? "text-emerald-500" : "text-rose-500"
                        }`}
                    >
                        {nextStatus}
                    </span>
                    ?
                </p>

                <div className='flex justify-end gap-3'>
                    <button
                        type='button'
                        onClick={onClose}
                        disabled={isLoading}
                        className='px-5 py-2 rounded-xl text-sm font-bold transition disabled:opacity-50
                        text-slate-700 border border-slate-200 hover:bg-slate-100
                        dark:text-slate-300 dark:border-white/10 dark:hover:bg-white/5'
                    >
                        Cancel
                    </button>

                    <button
                        type='button'
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-5 py-2 rounded-xl text-sm font-black uppercase tracking-wider transition
                        text-white flex items-center gap-2
                        ${
                            isActive
                                ? isLoading
                                    ? "bg-emerald-500/70 cursor-not-allowed"
                                    : "bg-emerald-500 hover:bg-emerald-600"
                                : isLoading
                                  ? "bg-rose-500/70 cursor-not-allowed"
                                  : "bg-rose-500 hover:bg-rose-600"
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className='animate-spin' />
                                Processing...
                            </>
                        ) : (
                            "Confirm"
                        )}
                    </button>
                </div>
            </div>
        </ModalShell>
    );
}
