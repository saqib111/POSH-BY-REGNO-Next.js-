"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FolderTree, Loader2 } from "lucide-react";
import ModalShell from "../../_ModalShell";

type CreateCategoryFormValues = {
    category_name: string;
};

type CreateCategoryModalProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: (values: CreateCategoryFormValues) => Promise<any>;
    isLoading?: boolean;
};

type BackendErrorShape = {
    response?: {
        data?: {
            message?: string;
            errors?: Record<string, string[]>;
        };
    };
};

export default function CreateCategoryModal({
    open,
    onClose,
    onConfirm,
    isLoading = false,
}: CreateCategoryModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<CreateCategoryFormValues>({
        defaultValues: {
            category_name: "",
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                category_name: "",
            });
        }
    }, [open, reset]);

    const submit = async (values: CreateCategoryFormValues) => {
        try {
            await onConfirm(values);
            onClose();
        } catch (err) {
            const e = err as BackendErrorShape;
            const backendErrors = e?.response?.data?.errors;

            if (backendErrors?.category_name?.[0]) {
                setError("category_name", {
                    type: "server",
                    message: backendErrors.category_name[0],
                });
                return;
            }

            setError("category_name", {
                type: "server",
                message:
                    e?.response?.data?.message || "Failed to create category.",
            });
        }
    };

    const submitting = isLoading || isSubmitting;

    return (
        <ModalShell
            open={open}
            onClose={onClose}
            title="Create Category"
            subtitle="Add a new category to organize your product structure."
        >
            <form onSubmit={handleSubmit(submit)} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        Category Name
                    </label>

                    <div className="relative">
                        <FolderTree
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                            size={18}
                        />

                        <input
                            {...register("category_name", {
                                required: "Category name is required",
                                minLength: {
                                    value: 2,
                                    message: "Min 2 characters",
                                },
                                maxLength: {
                                    value: 255,
                                    message: "Max 255 characters",
                                },
                            })}
                            disabled={submitting}
                            className="
                                w-full rounded-2xl p-4 pl-12 text-sm outline-none transition
                                bg-white border border-slate-200 text-slate-900 placeholder-slate-400
                                focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/15
                                dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-slate-500
                                dark:focus:border-amber-500/50 dark:focus:bg-white/10 dark:focus:ring-amber-500/15
                            "
                            placeholder="Enter category name"
                        />

                        {errors.category_name?.message ? (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-rose-600 dark:text-rose-500 font-black uppercase">
                                {errors.category_name.message}
                            </span>
                        ) : null}
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="
                            px-5 py-2 rounded-xl text-sm font-bold transition disabled:opacity-50
                            text-slate-700 border border-slate-200 hover:bg-slate-100
                            dark:text-slate-300 dark:border-white/10 dark:hover:bg-white/5
                        "
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={submitting}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition
                            ${
                                isLoading
                                    ? "bg-amber-600/70 cursor-not-allowed"
                                    : "bg-amber-600 hover:bg-amber-700"
                            }
                            text-white
                        `}
                    >
                        {submitting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Creating…
                            </>
                        ) : (
                            "Create Category"
                        )}
                    </button>
                </div>
            </form>
        </ModalShell>
    );
}