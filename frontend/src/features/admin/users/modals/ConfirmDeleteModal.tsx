/** @format */

"use client";

import React from "react";
import { Loader2, Trash2 } from "lucide-react";
import ModalShell from "../../_ModalShell";

type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userName: string;
    isLoading?: boolean;
};

export default function ConfirmDeleteModal({
    open,
    onClose,
    onConfirm,
    userName,
    isLoading = false,
}: Props) {
    if (!open) return null;

    return (
        <ModalShell
            open={open}
            onClose={onClose}
            title='Confirm Delete'
            subtitle='This action cannot be undone.'
        >
            <div className='space-y-6'>
                <div className='flex items-start gap-3'>
                    <div className='h-10 w-10 rounded-2xl bg-rose-600/10 text-rose-600 flex items-center justify-center'>
                        <Trash2 size={18} />
                    </div>
                    <p className='text-sm text-slate-600 dark:text-slate-300'>
                        You’re about to delete{" "}
                        <span className='font-black text-slate-900 dark:text-white'>
                            {userName}
                        </span>
                        . Continue?
                    </p>
                </div>

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
                            isLoading
                                ? "bg-rose-600/70 cursor-not-allowed"
                                : "bg-rose-600 hover:bg-rose-700"
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className='animate-spin' />
                                Deleting...
                            </>
                        ) : (
                            "Delete"
                        )}
                    </button>
                </div>
            </div>
        </ModalShell>
    );
}
