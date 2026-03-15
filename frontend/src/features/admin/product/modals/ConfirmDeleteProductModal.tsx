"use client";

import { Loader2, TriangleAlert } from "lucide-react";
import ModalShell from "../../_ModalShell";

type ConfirmDeleteProductModalProps = {
    open: boolean;
    productName: string;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
};

export default function ConfirmDeleteProductModal({
    open,
    productName,
    onClose,
    onConfirm,
    isLoading = false,
}: ConfirmDeleteProductModalProps) {
    return (
        <ModalShell
            open={open}
            onClose={onClose}
            title="Delete Product"
            subtitle="This action cannot be undone."
        >
            <div className="space-y-6">
                <div className="flex items-start gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/40 dark:bg-rose-950/20">
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                        <TriangleAlert size={18} />
                    </div>

                    <div className="space-y-1">
                        <h4 className="text-sm font-black uppercase tracking-wide text-slate-900 dark:text-white">
                            Confirm deletion
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            You are about to permanently delete{" "}
                            <span className="font-black text-rose-600 dark:text-rose-400">
                                {productName}
                            </span>.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="
                            px-5 py-2 rounded-xl text-sm font-bold transition disabled:opacity-50
                            text-slate-700 border border-slate-200 hover:bg-slate-100
                            dark:text-slate-300 dark:border-white/10 dark:hover:bg-white/5
                        "
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`
                            flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition
                            ${
                                isLoading
                                    ? "bg-rose-600/70 cursor-not-allowed"
                                    : "bg-rose-600 hover:bg-rose-700"
                            }
                            text-white
                        `}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Deleting…
                            </>
                        ) : (
                            "Delete Product"
                        )}
                    </button>
                </div>
            </div>
        </ModalShell>
    );
}