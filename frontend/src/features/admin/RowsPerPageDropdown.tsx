/** @format */

"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type RowsPerPageDropdownProps = {
    limit: number;
    setLimit: (limit: number) => void;
};

const RowsPerPageDropdown: React.FC<RowsPerPageDropdownProps> = ({
    limit,
    setLimit,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const options: number[] = [10, 25, 50, 100];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className='relative' ref={dropdownRef}>
            <button
                type='button'
                onClick={() => setIsOpen((v) => !v)}
                className='
          flex items-center gap-4
          bg-white dark:bg-slate-900
          px-5 py-3 rounded-2xl
          border border-slate-200 dark:border-slate-800
          shadow-sm
          hover:border-amber-600/50
          transition-all group
        '
            >
                <div className='flex flex-col items-start'>
                    <span className='text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-amber-600 transition-colors'>
                        Show
                    </span>
                    <span className='text-xs font-black dark:text-white tracking-tighter'>
                        {limit} Records
                    </span>
                </div>

                <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {isOpen && (
                <div
                    className='
            absolute top-full mt-3 left-0 w-32
            bg-white dark:bg-slate-900
            border border-slate-100 dark:border-slate-800
            rounded-2xl
            shadow-2xl z-50
            overflow-hidden
            animate-in fade-in zoom-in duration-200
          '
                >
                    <div className='p-2 space-y-1'>
                        {options.map((opt) => {
                            const active = limit === opt;

                            return (
                                <button
                                    key={opt}
                                    type='button'
                                    onClick={() => {
                                        setLimit(opt);
                                        setIsOpen(false);
                                    }}
                                    className={`
                    w-full text-left px-4 py-3 rounded-xl
                    text-[10px] font-black uppercase tracking-widest
                    transition-all
                    ${
                        active
                            ? "bg-slate-900 text-white dark:bg-white dark:text-black"
                            : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-amber-600"
                    }
                  `}
                                >
                                    {opt} Rows
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RowsPerPageDropdown;
