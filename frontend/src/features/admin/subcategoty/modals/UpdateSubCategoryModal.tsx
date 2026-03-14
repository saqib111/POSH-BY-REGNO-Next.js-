"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FolderTree, Loader2 } from "lucide-react";
import ModalShell from "./_ModalShell";
import CategoryAsyncSelect from "../components/CategoryAsyncSelect";
import type { SubCategory, UpdateSubCategoryPayload } from "../types";

type UpdateSubCategoryModalProps = {
    open: boolean;
    subCategory: SubCategory;
    onClose: () => void;
    onConfirm: (values: UpdateSubCategoryPayload) => Promise<any>;
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

export default function UpdateSubCategoryModal({
    open,
    subCategory,
    onClose,
    onConfirm,
    isLoading = false,
}: UpdateSubCategoryModalProps) {
    const [selectedCategoryLabel, setSelectedCategoryLabel] = useState<string | null>(
        subCategory.category_name
    );

    const {
        register,
        handleSubmit,
        reset,
        setError,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<UpdateSubCategoryPayload>({
        defaultValues: {
            category_id: subCategory.category_id,
            sub_category_name: subCategory.sub_category_name,
        },
    });

    const submitting = isLoading || isSubmitting;
    const categoryValue = watch("category_id");

    useEffect(() => {
        if (open) {
            reset({
                category_id: subCategory.category_id,
                sub_category_name: subCategory.sub_category_name,
            });
            setSelectedCategoryLabel(subCategory.category_name);
        }
    }, [open, subCategory, reset]);

    const submit = async (values: UpdateSubCategoryPayload) => {
        try {
            await onConfirm({
                category_id: Number(values.category_id),
                sub_category_name: values.sub_category_name.trim(),
            });
        } catch (err) {
            const e = err as BackendErrorShape;
            const backendErrors = e?.response?.data?.errors;

            if (backendErrors?.category_id?.[0]) {
                setError("category_id", {
                    type: "server",
                    message: backendErrors.category_id[0],
                });
            }

            if (backendErrors?.sub_category_name?.[0]) {
                setError("sub_category_name", {
                    type: "server",
                    message: backendErrors.sub_category_name[0],
                });
            }

            if (!backendErrors) {
                setError("sub_category_name", {
                    type: "server",
                    message:
                        e?.response?.data?.message ||
                        "Failed to update sub-category.",
                });
            }
        }
    };

    return (
        <ModalShell
            open={open}
            onClose={onClose}
            title="Update Sub Category"
            subtitle="Edit the sub-category name and change its parent category if needed."
        >
            <form onSubmit={handleSubmit(submit)} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        Parent Category
                    </label>

                    <input
                        type="hidden"
                        {...register("category_id", {
                            validate: (value) =>
                                Number(value) > 0 || "Category is required",
                        })}
                    />

                    <CategoryAsyncSelect
                        value={categoryValue || null}
                        selectedLabel={selectedCategoryLabel}
                        disabled={submitting}
                        error={errors.category_id?.message}
                        onChange={(val, option) => {
                            setValue("category_id", val, {
                                shouldValidate: true,
                                shouldDirty: true,
                            });
                            setSelectedCategoryLabel(option?.label || null);
                        }}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        Sub Category Name
                    </label>

                    <div className="relative">
                        <FolderTree
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                            size={18}
                        />

                        <input
                            {...register("sub_category_name", {
                                required: "Sub-category name is required",
                                validate: (value) =>
                                    value.trim().length > 0 ||
                                    "Sub-category name is required",
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
                            placeholder="Enter sub-category name"
                        />

                        {errors.sub_category_name?.message ? (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-rose-600 dark:text-rose-500 font-black uppercase">
                                {errors.sub_category_name.message}
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
                                submitting
                                    ? "bg-amber-600/70 cursor-not-allowed"
                                    : "bg-amber-600 hover:bg-amber-700"
                            }
                            text-white
                        `}
                    >
                        {submitting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Updating…
                            </>
                        ) : (
                            "Update Sub Category"
                        )}
                    </button>
                </div>
            </form>
        </ModalShell>
    );
}