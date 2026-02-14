/** @format */
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Providers from "./providers";
import { ThemeProvider } from "@/src/providers/ThemeProvider";
import { GlobalLoadingProvider } from "@/src/components/loading/GlobalLoadingProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = { title: "POSH BY REGNO" };

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body>
                {/* ✅ run BEFORE React so page doesn't flash */}
                <Script
                    id='theme-init'
                    strategy='beforeInteractive'
                    dangerouslySetInnerHTML={{
                        __html: `
(function () {
  try {
    var theme = localStorage.getItem("luxury_theme") || "light";
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = theme;
  } catch (e) {}
})();`,
                    }}
                />

                <Providers>
                    <ThemeProvider>
                        <GlobalLoadingProvider>
                            {children}
                            <Toaster
                                position='top-right'
                                toastOptions={{
                                    duration: 3500,
                                    style: {
                                        borderRadius: "16px",
                                        padding: "12px 14px",
                                    },
                                }}
                            />
                        </GlobalLoadingProvider>
                    </ThemeProvider>
                </Providers>
            </body>
        </html>
    );
}
