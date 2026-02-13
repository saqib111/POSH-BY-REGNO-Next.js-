/** @format */
"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

type Theme = "light" | "dark";

type ThemeCtx = {
    theme: Theme;
    darkMode: boolean;
    setTheme: (t: Theme) => void;
    toggle: () => void;
};

const ThemeContext = createContext<ThemeCtx | null>(null);

function applyThemeToDOM(theme: Theme) {
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light"; // ✅ better inputs/scrollbars
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("light");

    // ✅ on first client render: read saved theme
    useEffect(() => {
        try {
            const saved =
                (localStorage.getItem("luxury_theme") as Theme) || "light";
            setThemeState(saved);
            applyThemeToDOM(saved);
        } catch {}
    }, []);

    const setTheme = (t: Theme) => {
        setThemeState(t);
        try {
            localStorage.setItem("luxury_theme", t);
        } catch {}
        applyThemeToDOM(t);
    };

    const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

    const value = useMemo(
        () => ({ theme, darkMode: theme === "dark", setTheme, toggle }),
        [theme],
    );

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
    return ctx;
}
