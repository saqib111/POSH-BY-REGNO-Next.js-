"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmDeleteProductModal from "../modals/ConfirmDeleteProductModal";
import UpdateProductModal from "../modals/UpdateProductModal";
import { useDeleteProductMutation } from "../hooks/useDeleteProductMutation";
import { useUpdateProductMutation } from "../hooks/useUpdateProductMutation";
import type { Product } from "../types";

type ProductRowProps = {
    product: Product;
    index: number;
    page: number;
    limit: number;
};

const ProductRow = ({ product, index, page, limit }: ProductRowProps) => {
    const serialNumber = (page - 1) * limit + index + 1;

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const updateMutation = useUpdateProductMutation({
        productId: product.id,
        onClose: () => setEditOpen(false),
    });

    const deleteMutation = useDeleteProductMutation({
        productId: product.id,
        productName: product.product_name,
        onClose: () => setDeleteOpen(false),
    });

    const isUpdating = updateMutation.isPending;
    const isDeleting = deleteMutation.isPending;
    const disableActions = isUpdating || isDeleting;

    return (
        <>
            <tr
                className="
                    group relative
                    transition-all duration-300
                    hover:bg-emerald-50/40 dark:hover:bg-emerald-600/5
                "
            >
                <td className="pl-12 py-7">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center" />
                    <span className="text-[11px] font-black text-slate-400 dark:text-slate-700 font-mono">
                        {serialNumber.toLocaleString("en-US", {
                            minimumIntegerDigits: 2,
                        })}
                    </span>
                </td>

                <td className="px-10 py-7">
                    <span className="text-sm font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                        {product.product_name}
                    </span>
                </td>

                <td className="px-10 py-7">
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
                        {product.sku || "N/A"}
                    </span>
                </td>

                <td className="px-10 py-7">
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                        {product.category_name}
                    </span>
                </td>

                <td className="px-10 py-7">
                    <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-300">
                        {product.sub_category_name}
                    </span>
                </td>

                <td className="px-10 py-7">
                    <div className="flex items-center gap-3">
                        <div
                            className="
                                hidden sm:flex h-8 w-8 items-center justify-center rounded-lg
                                bg-slate-50 border border-slate-200
                                dark:bg-slate-800/50 dark:border-slate-700/40
                            "
                        >
                            <svg
                                className="h-4 w-4 text-slate-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>

                        <div className="flex flex-col space-y-0.5">
                            {product.created_at ? (
                                <>
                                    <span className="text-[13px] font-semibold tracking-tight text-slate-700 dark:text-slate-200">
                                        {new Date(product.created_at).toLocaleDateString(
                                            undefined,
                                            {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            }
                                        )}
                                    </span>
                                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-500">
                                        {new Date(product.created_at).toLocaleTimeString(
                                            undefined,
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                    </span>
                                </>
                            ) : (
                                <span className="text-slate-400 dark:text-slate-600">
                                    —
                                </span>
                            )}
                        </div>
                    </div>
                </td>

                <td className="px-10 py-7 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setEditOpen(true)}
                            disabled={disableActions}
                            className="
                                inline-flex items-center justify-center
                                p-2.5 rounded-xl
                                transition-all duration-300
                                border border-transparent
                                shadow-sm hover:shadow-md
                                active:scale-90
                                disabled:opacity-50 disabled:cursor-not-allowed
                                text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10
                                hover:bg-emerald-600 hover:text-white
                            "
                        >
                            <Pencil size={16} strokeWidth={2.2} />
                        </button>

                        <button
                            type="button"
                            onClick={() => setDeleteOpen(true)}
                            disabled={disableActions}
                            className="
                                inline-flex items-center justify-center
                                p-2.5 rounded-xl
                                transition-all duration-300
                                border border-transparent
                                shadow-sm hover:shadow-md
                                active:scale-90
                                disabled:opacity-50 disabled:cursor-not-allowed
                                text-rose-600 bg-rose-50 dark:bg-rose-500/10
                                hover:bg-rose-600 hover:text-white
                            "
                        >
                            <Trash2 size={16} strokeWidth={2.2} />
                        </button>
                    </div>
                </td>
            </tr>

            <ConfirmDeleteProductModal
                open={deleteOpen}
                productName={product.product_name}
                onClose={() => setDeleteOpen(false)}
                onConfirm={() => deleteMutation.mutate()}
                isLoading={isDeleting}
            />

            <UpdateProductModal
                open={editOpen}
                product={product}
                onClose={() => setEditOpen(false)}
                onConfirm={(payload) => updateMutation.mutateAsync(payload)}
                isLoading={isUpdating}
            />
        </>
    );
};

export default ProductRow;