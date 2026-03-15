/** @format */
"use client";

import { useTheme } from "@/src/providers/ThemeProvider";

export function useDarkMode() {
    const { darkMode, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(darkMode ? "light" : "dark");
    };

    return {
        darkMode,
        toggle: toggleTheme,
        setDarkMode: (v: boolean) => setTheme(v ? "dark" : "light"),
    };
}