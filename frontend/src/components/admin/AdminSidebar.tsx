/** @format */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CircleDot,
    X,
    UserCog,
    Folder,
    ChartBarStacked,
    Package,
} from "lucide-react";

type Props = {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
};

type NavItem = { name: string; icon: any; path: string };
type Section = { header: string; items: NavItem[] };

export default function AdminSidebar({ isOpen, setIsOpen }: Props) {
    const pathname = usePathname();

    const sections: Section[] = [
        {
            header: "Main",
            items: [
                {
                    name: "Intelligence",
                    icon: LayoutDashboard,
                    path: "/admin/dashboard",
                },
            ],
        },
        {
            header: "Administration",
            items: [
                {
                    name: "Manage Users",
                    icon: UserCog,
                    path: "/admin/manage-user",
                },
                { name: "Category", icon: Folder, path: "/admin/category" },
                {
                    name: "Sub-Category",
                    icon: ChartBarStacked,
                    path: "/admin/sub-category",
                },
                { name: "Product", icon: Package, path: "/admin/product" },
            ],
        },
    ];

    const isActive = (path: string) =>
        pathname === path || pathname.startsWith(path + "/");

    const SectionHeader = ({ title }: { title: string }) => {
        if (!isOpen) return null;
        return (
            <div className='flex items-center gap-3 px-1 pt-7 pb-2'>
                <span className='w-1.5 h-1.5 rounded-full bg-amber-500/80 shadow-[0_0_0_4px_rgba(245,158,11,0.10)]' />
                <span className='text-[10px] font-black uppercase tracking-[0.45em] text-slate-400'>
                    {title}
                </span>
            </div>
        );
    };

    const Item = ({ item }: { item: NavItem }) => {
        const active = isActive(item.path);
        const Icon = item.icon;

        return (
            <Link
                href={item.path}
                className={`
                    relative w-full flex items-center justify-between
                    ${isOpen ? "px-4 py-3.5" : "px-3 py-3"}
                    rounded-2xl transition-all duration-300 group
                    border border-transparent
                    ${
                        active
                            ? `
                        bg-slate-100 text-slate-900 border-slate-200/70
                        shadow-sm
                        dark:bg-white/5 dark:text-white dark:border-white/10
                      `
                            : `
                        text-slate-500 hover:text-slate-900
                        hover:bg-slate-50/80 hover:border-slate-200/60
                        dark:text-slate-400 dark:hover:text-slate-100
                        dark:hover:bg-white/3 dark:hover:border-white/10
                      `
                    }
                    hover:-translate-y-px active:translate-y-0
                `}
                onClick={() => {
                    if (window.innerWidth < 768) setIsOpen(false);
                }}
            >
                {/* Left accent bar */}
                <span
                    className={`
                        absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full
                        transition-all duration-300
                        ${
                            active
                                ? "bg-amber-600"
                                : "bg-transparent group-hover:bg-slate-200/80 dark:group-hover:bg-white/10"
                        }
                    `}
                />

                <div
                    className={`flex items-center ${
                        isOpen ? "gap-4" : "gap-0 justify-center w-full"
                    }`}
                >
                    <span
                        className={`
                            inline-flex items-center justify-center
                            ${isOpen ? "" : "w-12 h-12 rounded-2xl"}
                            transition-all duration-300
                            ${
                                active
                                    ? "text-amber-600 scale-[1.03]"
                                    : "opacity-70 group-hover:opacity-100"
                            }
                            ${
                                !isOpen
                                    ? "bg-slate-50 border border-slate-200/60 dark:bg-white/3 dark:border-white/10"
                                    : ""
                            }
                        `}
                    >
                        <Icon size={20} />
                    </span>

                    {isOpen && (
                        <div className='flex flex-col leading-none'>
                            <span className='text-sm font-bold tracking-tight'>
                                {item.name}
                            </span>
                            <span
                                className={`
                                    mt-1 text-[10px] uppercase tracking-[0.22em]
                                    ${
                                        active
                                            ? "text-amber-600/80 dark:text-amber-400/80"
                                            : "text-slate-400/0 group-hover:text-slate-400 dark:text-slate-500/0 dark:group-hover:text-slate-500"
                                    }
                                    transition-colors duration-300
                                `}
                            >
                                Navigate
                            </span>
                        </div>
                    )}
                </div>

                {isOpen && active && (
                    <div className='w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white' />
                )}
            </Link>
        );
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className='fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden'
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`
                    fixed top-0 left-0 h-full z-50
                    ${
                        isOpen
                            ? "w-72 translate-x-0"
                            : "w-24 -translate-x-full md:translate-x-0"
                    }
                    flex flex-col
                    bg-white dark:bg-[#020617]
                    border-r border-slate-200/60 dark:border-slate-800/50
                    shadow-[6px_0_30px_rgba(0,0,0,0.04)]
                    transition-all duration-500 ease-in-out
                `}
            >
                {/* Top Brand */}
                <div className='h-24 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800/30'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-2xl bg-slate-900 dark:bg-slate-100 flex items-center justify-center shadow-lg'>
                            <CircleDot
                                className='text-white dark:text-black'
                                size={22}
                            />
                        </div>

                        {isOpen && (
                            <div className='flex flex-col leading-none'>
                                <span className='text-lg font-black tracking-[0.2em] dark:text-white uppercase'>
                                    Nexus
                                </span>
                                <span className='text-[10px] font-black uppercase tracking-[0.35em] text-slate-400'>
                                    Console
                                </span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setIsOpen(false)}
                        className='md:hidden text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition'
                        aria-label='Close sidebar'
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Nav */}
                <nav className='flex-1 px-5 pb-8 pt-2 overflow-y-auto'>
                    {sections.map((section) => (
                        <div key={section.header} className='space-y-2'>
                            <SectionHeader title={section.header} />
                            <div className='space-y-2'>
                                {section.items.map((item) => (
                                    <Item key={item.name} item={item} />
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Bottom card */}
                {isOpen && (
                    <div className='mx-4 mb-6 mt-auto'>
                        <div className='group relative cursor-pointer active:scale-95 transition-all duration-300'>
                            {/* Glow */}
                            <div className='absolute -inset-2 bg-indigo-500/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100 dark:bg-indigo-400/5' />

                            {/* Main Card */}
                            <div className='relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 p-3 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/30 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/90 flex items-center justify-between'>
                                {/* ✅ SHIMMER */}
                                <div className='shimmer-layer' />

                                <div className='flex items-center gap-4'>
                                    {/* Icon Section with Dot-Grid Pattern */}
                                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,var(--tw-gradient-from)_1px,transparent_0)] from-slate-400 bg-size-[6px_6px] dark:from-slate-500" />

                                        <svg
                                            className="relative h-6 w-6 text-indigo-600 dark:text-indigo-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.8}
                                                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 003.112 13M13 13c1.973 0 3.692 1.232 4.446 2.996m-.896-11.45L13 7m0 0l-1.5-1.5M13 7l1.5-1.5M3 3l3.5 3.5"
                                            />
                                        </svg>

                                        <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-slate-900">
                                            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                                        </div>
                                    </div>

                                    {/* Text */}
                                    <div className='flex flex-col space-y-0.5'>
                                        <span className='text-[13px] font-bold tracking-tight text-slate-800 dark:text-slate-100'>
                                            Superadmin
                                        </span>

                                        <div className='flex items-center gap-1.5'>
                                            <span className='text-[10px] font-medium tracking-wide text-slate-500/80 dark:text-slate-400'>
                                                System Active
                                            </span>
                                            <span className='flex h-1 w-1 rounded-full bg-indigo-500/40' />
                                        </div>
                                    </div>
                                </div>

                                {/* PRO Badge */}
                                <div className='px-2'>
                                    <div className='rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-1 text-[10px] font-extrabold tracking-widest text-indigo-600 transition-colors duration-300 group-hover:bg-indigo-600 group-hover:text-white dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400'>
                                        PRO
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
}
