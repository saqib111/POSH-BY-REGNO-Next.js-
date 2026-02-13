/** @format */
"use client";

import { useTheme } from "@/src/providers/ThemeProvider";

export function useDarkMode() {
    const { darkMode, setTheme, toggleTheme, hydrated } = useTheme();

    return {
        darkMode,
        hydrated,
        toggle: toggleTheme,
        setDarkMode: (v: boolean) => setTheme(v ? "dark" : "light"),
    };
}
