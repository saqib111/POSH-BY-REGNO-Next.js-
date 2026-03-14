"use client";

import SubCategoryTable from "@/src/features/admin/subcategoty/components/SubcategoryTable";
import { useSubCategoriesQuery } from "@/src/features/admin/subcategoty/hooks/useSubCategoriesQuery";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Layers,
    Plus,
    Search,
} from "lucide-react";
import { useState } from "react";

export default function SubCategoryPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading, isError, error } = useSubCategoriesQuery({
        search,
        page,
        limit,
    });

    const totalPages = data?.totalPages ?? 1;
    const totalSubCategories = data?.totalSubCategories ?? 0;

    return (
        <div className="space-y-10">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Layers size={18} className="text-amber-600 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-500 dark:text-slate-400">
                            Taxonomy & Organization
                        </span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white leading-none">
                        Sub{" "}
                        <span className="font-thin text-slate-300 dark:text-slate-800 italic underline decoration-amber-600/30">
                            Categories
                        </span>
                    </h1>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="QUERY SUB CATEGORIES..."
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
                                focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 outline-none transition-all
                                shadow-sm
                                dark:bg-slate-900/50 dark:text-white dark:border-slate-800 dark:placeholder:text-slate-500
                            "
                        />
                    </div>

                    <div className="group pt-1">
                        <button
                            type="button"
                            className="
                                flex items-center gap-3
                                bg-slate-900 text-white
                                dark:bg-white dark:text-black
                                px-8 py-4 rounded-2xl
                                font-black text-[10px] uppercase tracking-widest
                                transition-all duration-300
                                shadow-2xl
                                hover:-translate-y-1
                                hover:bg-amber-600
                                dark:hover:bg-amber-600 dark:hover:text-white
                            "
                        >
                            <Plus size={20} /> New Sub Category
                        </button>
                    </div>
                </div>
            </div>

            {isError && (
                <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-200 text-sm">
                    Failed to load sub-categories.{" "}
                    <span className="opacity-80">
                        {(error as any)?.response?.data?.message ||
                            (error as any)?.message ||
                            "Please try again."}
                    </span>
                </div>
            )}

            <SubCategoryTable
                subCategories={data?.subCategories ?? []}
                isLoading={isLoading}
                page={page}
                limit={limit}
                search={search}
            />

            <div className="px-6 md:px-10 py-8 border border-slate-200 dark:border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/70 dark:bg-slate-900/20 rounded-3xl shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {Number(totalSubCategories).toLocaleString()} Sub Categories Indexed
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
                        <div className="absolute -inset-1 bg-amber-600/30 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-700" />
                        <div className="relative h-12 min-w-16 px-4 flex items-center justify-center bg-slate-900 dark:bg-white rounded-2xl shadow-2xl">
                            <span className="text-xs font-black text-white dark:text-black">
                                {page} / {totalPages}
                            </span>
                        </div>
                    </div>

                    <NavButton
                        onClick={() =>
                            setPage((prev) => Math.min(totalPages, prev + 1))
                        }
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
            hover:border-amber-600 hover:text-amber-600
            transition-all shadow-sm
            disabled:opacity-20 disabled:cursor-not-allowed
            dark:bg-slate-800 dark:text-white dark:border-slate-700
        "
    >
        {icon}
    </button>
);