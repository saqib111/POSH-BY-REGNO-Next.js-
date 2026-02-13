/** @format */

import React from "react";
import Navbar from "@/src/components/layout/Navbar";

export default function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main className='mx-auto max-w-6xl px-4 py-8'>{children}</main>
        </>
    );
}
