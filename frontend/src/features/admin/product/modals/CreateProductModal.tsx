"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FolderTree, Loader2, Package, ScanLine } from "lucide-react";
import ModalShell from "../../_ModalShell";
import ProductCategoryAsyncSelect from "../components/ProductCategoryAsyncSelect";
import ProductSubCategoryAsyncSelect from "../components/ProductSubCategoryAsyncSelect";
import type { CreateProductPayload } from "../types";

type CreateProductModalProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: (values: CreateProductPayload) => Promise<any>;
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

export default function CreateProductModal({
    open,
    onClose,
    onConfirm,
    isLoading = false,
}: CreateProductModalProps) {
    const [selectedCategoryLabel, setSelectedCategoryLabel] = useState<string | null>(null);
    const [selectedSubCategoryLabel, setSelectedSubCategoryLabel] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CreateProductPayload>({
        defaultValues: {
            category_id: 0,
            sub_category_id: 0,
            product_name: "",
            sku: null,
        },
    });

    const submitting = isLoading || isSubmitting;

    const categoryValue = watch("category_id");
    const subCategoryValue = watch("sub_category_id");

    useEffect(() => {
        if (open) {
            reset({
                category_id: 0,
                sub_category_id: 0,
                product_name: "",
                sku: null,
            });
            setSelectedCategoryLabel(null);
            setSelectedSubCategoryLabel(null);
        }
    }, [open, reset]);

    const submit = async (values: CreateProductPayload) => {
        try {
            await onConfirm({
                category_id: Number(values.category_id),
                sub_category_id: Number(values.sub_category_id),
                product_name: values.product_name.trim(),
                sku: values.sku?.trim() ? values.sku.trim() : null,
            });

            onClose();
        } catch (err) {
            const e = err as BackendErrorShape;
            const backendErrors = e?.response?.data?.errors;

            if (backendErrors?.category_id?.[0]) {
                setError("category_id", {
                    type: "server",
                    message: backendErrors.category_id[0],
                });
            }

            if (backendErrors?.sub_category_id?.[0]) {
                setError("sub_category_id", {
                    type: "server",
                    message: backendErrors.sub_category_id[0],
                });
            }

            if (backendErrors?.product_name?.[0]) {
                setError("product_name", {
                    type: "server",
                    message: backendErrors.product_name[0],
                });
            }

            if (backendErrors?.sku?.[0]) {
                setError("sku", {
                    type: "server",
                    message: backendErrors.sku[0],
                });
            }

            if (!backendErrors) {
                setError("product_name", {
                    type: "server",
                    message:
                        e?.response?.data?.message || "Failed to create product.",
                });
            }
        }
    };

    return (
        <ModalShell
            open={open}
            onClose={onClose}
            title="Create Product"
            subtitle="Create a new product with category and dependent sub-category selection."
        >
            <form onSubmit={handleSubmit(submit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            Category
                        </label>

                        <input
                            type="hidden"
                            {...register("category_id", {
                                validate: (value) =>
                                    Number(value) > 0 || "Category is required",
                            })}
                        />

                        <ProductCategoryAsyncSelect
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

                                // reset dependent sub-category
                                setValue("sub_category_id", 0, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                });
                                setSelectedSubCategoryLabel(null);
                            }}
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            Sub Category
                        </label>

                        <input
                            type="hidden"
                            {...register("sub_category_id", {
                                validate: (value) =>
                                    Number(value) > 0 ||
                                    "Sub-category is required",
                            })}
                        />

                        <ProductSubCategoryAsyncSelect
                            categoryId={categoryValue ? Number(categoryValue) : null}
                            value={subCategoryValue || null}
                            selectedLabel={selectedSubCategoryLabel}
                            disabled={submitting}
                            error={errors.sub_category_id?.message}
                            onChange={(val, option) => {
                                setValue("sub_category_id", val, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                });
                                setSelectedSubCategoryLabel(option?.label || null);
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            Product Name
                        </label>

                        <div className="relative">
                            <Package
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                size={18}
                            />

                            <input
                                {...register("product_name", {
                                    required: "Product name is required",
                                    validate: (value) =>
                                        value.trim().length > 0 ||
                                        "Product name is required",
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
                                    focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/15
                                    dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-slate-500
                                    dark:focus:border-emerald-500/50 dark:focus:bg-white/10 dark:focus:ring-emerald-500/15
                                "
                                placeholder="Enter product name"
                            />

                            {errors.product_name?.message ? (
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-rose-600 dark:text-rose-500 font-black uppercase">
                                    {errors.product_name.message}
                                </span>
                            ) : null}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            SKU
                        </label>

                        <div className="relative">
                            <ScanLine
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                                size={18}
                            />

                            <input
                                {...register("sku", {
                                    maxLength: {
                                        value: 100,
                                        message: "Max 100 characters",
                                    },
                                })}
                                disabled={submitting}
                                className="
                                    w-full rounded-2xl p-4 pl-12 text-sm outline-none transition
                                    bg-white border border-slate-200 text-slate-900 placeholder-slate-400
                                    focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/15
                                    dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-slate-500
                                    dark:focus:border-emerald-500/50 dark:focus:bg-white/10 dark:focus:ring-emerald-500/15
                                "
                                placeholder="Optional SKU"
                            />

                            {errors.sku?.message ? (
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-rose-600 dark:text-rose-500 font-black uppercase">
                                    {errors.sku.message}
                                </span>
                            ) : null}
                        </div>
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
                                    ? "bg-emerald-600/70 cursor-not-allowed"
                                    : "bg-emerald-600 hover:bg-emerald-700"
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
                            "Create Product"
                        )}
                    </button>
                </div>
            </form>
        </ModalShell>
    );
}