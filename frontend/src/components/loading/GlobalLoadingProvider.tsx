/** @format */
"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import Preloader from "@/src/components/Preloader";

type Ctx = {
    show: () => void;
    hide: () => void;
    set: (v: boolean) => void;
    isOpen: boolean;
};

const GlobalLoadingContext = createContext<Ctx | null>(null);

export function GlobalLoadingProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const value = useMemo<Ctx>(
        () => ({
            isOpen,
            show: () => setIsOpen(true),
            hide: () => setIsOpen(false),
            set: (v) => setIsOpen(v),
        }),
        [isOpen],
    );

    return (
        <GlobalLoadingContext.Provider value={value}>
            {children}

            {/* Full-screen overlay */}
            {isOpen && (
                <div className='fixed inset-0 z-[9999]'>
                    <Preloader />
                </div>
            )}
        </GlobalLoadingContext.Provider>
    );
}

export function useGlobalLoading() {
    const ctx = useContext(GlobalLoadingContext);
    if (!ctx)
        throw new Error(
            "useGlobalLoading must be used inside GlobalLoadingProvider",
        );
    return ctx;
}
