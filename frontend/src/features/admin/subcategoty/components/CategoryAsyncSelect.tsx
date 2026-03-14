"use client";

import {
    Check,
    ChevronDown,
    Layers,
    Loader2,
    Search,
} from "lucide-react";
import {
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import { useInfiniteCategoryOptionsQuery } from "../hooks/useInfiniteCategoryOptionsQuery";
import type { CategoryOption } from "../types";

type CategoryAsyncSelectProps = {
    value: number | null;
    selectedLabel?: string | null;
    onChange: (value: number, option?: CategoryOption) => void;
    disabled?: boolean;
    error?: string;
};

type DropdownPosition = {
    top: number;
    left: number;
    width: number;
};

export default function CategoryAsyncSelect({
    value,
    selectedLabel,
    onChange,
    disabled = false,
    error,
}: CategoryAsyncSelectProps) {
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);

    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [position, setPosition] = useState<DropdownPosition | null>(null);

    const limit = 5;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
        }, 350);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const {
        data,
        isLoading,
        isFetching,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteCategoryOptionsQuery({
        search,
        limit,
    });

    const options = useMemo(() => {
        return data?.pages.flatMap((page) => page.options) ?? [];
    }, [data]);

    const selectedOption = useMemo(() => {
        return options.find((option) => option.value === value) ?? null;
    }, [options, value]);

    const displayLabel =
        selectedOption?.label || selectedLabel || "Select category";

    const loading = isLoading || isFetching;

    const updatePosition = () => {
        if (!triggerRef.current) return;

        const rect = triggerRef.current.getBoundingClientRect();

        setPosition({
            top: rect.bottom + 12 + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
        });
    };

    useLayoutEffect(() => {
        if (!open) return;
        updatePosition();
    }, [open]);

    useEffect(() => {
        if (!open) return;

        const handleResize = () => updatePosition();
        const handleScrollWindow = () => updatePosition();

        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScrollWindow, true);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScrollWindow, true);
        };
    }, [open]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            const clickedTrigger =
                triggerRef.current?.contains(target) ?? false;
            const clickedDropdown =
                dropdownRef.current?.contains(target) ?? false;

            if (!clickedTrigger && !clickedDropdown) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    useEffect(() => {
        if (!open) {
            setSearchInput("");
            setSearch("");
        }
    }, [open]);

    // FIXED: auto-fetch more pages on first open until scrolling becomes possible
    useEffect(() => {
        if (!open) return;
        if (!hasNextPage) return;
        if (isFetchingNextPage) return;
        if (isLoading) return;

        let frameId = 0;

        const checkAndLoad = async () => {
            const el = listRef.current;
            if (!el) return;

            const isScrollable = el.scrollHeight > el.clientHeight;

            if (!isScrollable && hasNextPage && !isFetchingNextPage) {
                await fetchNextPage();
            }
        };

        frameId = window.requestAnimationFrame(() => {
            void checkAndLoad();
        });

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, [
        open,
        options.length,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        fetchNextPage,
    ]);

    const handleScroll = async (
        e: React.UIEvent<HTMLDivElement>
    ) => {
        const el = e.currentTarget;

        const distanceFromBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight;

        if (
            distanceFromBottom < 80 &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            await fetchNextPage();
        }
    };

    const dropdown = open && position ? (
        <div
            ref={dropdownRef}
            style={{
                position: "absolute",
                top: position.top,
                left: position.left,
                width: position.width,
                zIndex: 10050,
            }}
            className="
                overflow-hidden rounded-3xl
                border border-slate-200 bg-white shadow-2xl
                dark:border-slate-800 dark:bg-slate-950
            "
        >
            <div className="border-b border-slate-200 p-4 dark:border-slate-800">
                <div className="relative">
                    <Search
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search category..."
                        className="
                            w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4
                            text-sm outline-none transition
                            focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/15
                            dark:border-slate-800 dark:bg-slate-900/60 dark:text-white
                        "
                        autoFocus
                    />
                </div>
            </div>

            <div
                ref={listRef}
                className="max-h-72 overflow-y-auto p-2"
                onScroll={handleScroll}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
                        <Loader2 size={16} className="animate-spin" />
                        Loading categories...
                    </div>
                ) : options.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
                            <Search size={18} className="text-amber-600" />
                        </div>
                        <p className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                            No matching categories found
                        </p>
                    </div>
                ) : (
                    <>
                        {options.map((option) => {
                            const isSelected = value === option.value;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value, option);
                                        setOpen(false);
                                    }}
                                    className={`
                                        flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition
                                        ${
                                            isSelected
                                                ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                                                : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900/60"
                                        }
                                    `}
                                >
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-bold">
                                            {option.label}
                                        </div>
                                    </div>

                                    {isSelected ? (
                                        <Check
                                            size={16}
                                            className="shrink-0 text-amber-600"
                                        />
                                    ) : null}
                                </button>
                            );
                        })}

                        {isFetchingNextPage && (
                            <div className="flex items-center justify-center gap-2 px-4 py-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                <Loader2 size={14} className="animate-spin" />
                                Loading more...
                            </div>
                        )}

                        {!hasNextPage && options.length > 0 && (
                            <div className="px-4 py-4 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                End of categories
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    ) : null;

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                disabled={disabled}
                onClick={() => {
                    if (disabled) return;
                    setOpen((prev) => !prev);
                }}
                className={`
                    w-full rounded-2xl p-4 text-left outline-none transition
                    border bg-white text-slate-900
                    dark:bg-white/5 dark:text-white
                    flex items-center justify-between gap-4
                    ${
                        error
                            ? "border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                            : "border-slate-200 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/15 dark:border-white/10 dark:focus:border-amber-500/50"
                    }
                    ${disabled ? "opacity-60 cursor-not-allowed" : ""}
                `}
            >
                <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5">
                        <Layers size={16} className="text-amber-600" />
                    </div>

                    <div className="min-w-0">
                        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                            Parent Category
                        </div>
                        <div className="truncate text-sm font-bold text-slate-900 dark:text-white">
                            {displayLabel}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {loading && open ? (
                        <Loader2
                            size={16}
                            className="animate-spin text-slate-400"
                        />
                    ) : null}

                    <ChevronDown
                        size={18}
                        className={`shrink-0 text-slate-400 transition-transform ${
                            open ? "rotate-180" : ""
                        }`}
                    />
                </div>
            </button>

            {error ? (
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-rose-600 dark:text-rose-500">
                    {error}
                </p>
            ) : null}

            {mounted && dropdown ? createPortal(dropdown, document.body) : null}
        </>
    );
}