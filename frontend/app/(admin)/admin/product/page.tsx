/** @format */
"use client";

import ProductTable from "@/src/features/admin/product/components/ProductTable";
import { useProductsQuery } from "@/src/features/admin/product/hooks/useProductsQuery";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Package,
    Plus,
    Search,
} from "lucide-react";
import { useState } from "react";
import CreateProductModal from "@/src/features/admin/product/modals/CreateProductModal";
import { useCreateProductMutation } from "@/src/features/admin/product/hooks/useCreateProductMutation";
import RowsPerPageDropdown from "@/src/features/admin/RowsPerPageDropdown";

export default function ProductPage() {
    // --- UI STATE ---
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [createOpen, setCreateOpen] = useState(false);
    const { data, isLoading, isError, error } = useProductsQuery({
        search,
        page,
        limit,
    });

    const createMutation = useCreateProductMutation();

    const totalPages = data?.totalPages ?? 1;
    const totalProducts = data?.totalProducts ?? 0;

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Package size={18} className="text-emerald-600 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-500 dark:text-slate-400">
                            Inventory & Catalog
                        </span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white leading-none">
                        Products
                    </h1>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">

                    <RowsPerPageDropdown
                        limit={limit}
                        setLimit={handleLimitChange}
                    />

                    <div className="relative flex-1 md:w-80 group">
                        <Search
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="QUERY PRODUCTS..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="
                                w-full rounded-2xl py-4 pl-14 pr-6
                                text-[11px] font-bold uppercase tracking-[0.2em]
                                bg-white text-slate-900 border border-slate-200
                                placeholder:text-slate-400
                                focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none transition-all
                                shadow-sm
                                dark:bg-slate-900/50 dark:text-white dark:border-slate-800 dark:placeholder:text-slate-500
                            "
                        />
                    </div>

                    <div className="group pt-1">
                        <button
                            type="button"
                            onClick={() => setCreateOpen(true)}
                            className="
                                flex items-center gap-3
                                bg-slate-900 text-white
                                dark:bg-white dark:text-black
                                px-8 py-4 rounded-2xl
                                font-black text-[10px] uppercase tracking-widest
                                transition-all duration-300
                                shadow-2xl
                                hover:-translate-y-1
                                hover:bg-emerald-600
                                dark:hover:bg-emerald-600 dark:hover:text-white
                            "
                        >
                            <Plus size={20} /> New Product
                        </button>
                    </div>
                </div>
            </div>

            {/* Error */}
            {isError && (
                <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-200 text-sm">
                    Failed to load products.{" "}
                    <span className="opacity-80">
                        {(error as any)?.response?.data?.message ||
                            (error as any)?.message ||
                            "Please try again."}
                    </span>
                </div>
            )}

            {/* Table */}
            <ProductTable
                products={data?.products ?? []}
                isLoading={isLoading}
                page={page}
                limit={limit}
                search={search}
            />

            {/* Pagination */}
            <div className="px-6 md:px-10 py-8 border border-slate-200 dark:border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/70 dark:bg-slate-900/20 rounded-3xl shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {Number(totalProducts).toLocaleString()} Products Indexed
                </span>

                <div className="flex items-center gap-3">
                    <NavButton
                        onClick={() => setPage(1)}
                        disabled={page === 1 || isLoading}
                        icon={<ChevronsLeft size={18} />}
                    />

                    <NavButton
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={page === 1 || isLoading}
                        icon={<ChevronLeft size={18} />}
                    />

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-emerald-600/30 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-700" />
                        <div className="relative h-12 min-w-16 px-4 flex items-center justify-center bg-slate-900 dark:bg-white rounded-2xl shadow-2xl">
                            <span className="text-xs font-black text-white dark:text-black">
                                {page} / {totalPages}
                            </span>
                        </div>
                    </div>

                    <NavButton
                        onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={page === totalPages || isLoading}
                        icon={<ChevronRight size={18} />}
                    />

                    <NavButton
                        onClick={() => setPage(totalPages)}
                        disabled={page === totalPages || isLoading}
                        icon={<ChevronsRight size={18} />}
                    />
                </div>
            </div>

            {/* Create Modal */}
            <CreateProductModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onConfirm={(values) => createMutation.mutateAsync(values)}
                isLoading={createMutation.isPending}
            />
        </div>
    );
}

const NavButton = ({
    onClick,
    disabled,
    icon,
}: {
    onClick: () => void;
    disabled: boolean;
    icon: React.ReactNode;
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="
            p-3.5 rounded-2xl
            bg-white text-slate-700 border border-slate-200
            hover:border-emerald-600 hover:text-emerald-600
            transition-all shadow-sm
            disabled:opacity-20 disabled:cursor-not-allowed
            dark:bg-slate-800 dark:text-white dark:border-slate-700
        "
    >
        {icon}
    </button>
);
