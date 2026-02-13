/** @format */
"use client";

import { Crown } from "lucide-react";

export default function Preloader() {
    return (
        <div className='min-h-screen bg-[#030712] flex flex-col items-center justify-center relative overflow-hidden'>
            {/* Background Aura */}
            <div className='absolute w-64 h-64 bg-amber-600/20 rounded-full blur-[100px] animate-pulse' />

            <div className='relative flex flex-col items-center'>
                {/* Pulsing Crown Logo */}
                <div className='relative group'>
                    <div className='absolute inset-0 bg-amber-500/20 rounded-full blur-xl animate-ping' />
                    <div className='relative p-6 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl'>
                        <Crown
                            className='text-amber-500 animate-bounce'
                            size={48}
                            strokeWidth={1.5}
                        />
                    </div>
                </div>

                {/* Shimmering Text */}
                <div className='mt-10 flex flex-col items-center gap-3'>
                    <p className='text-white font-black tracking-[0.6em] uppercase text-[10px] animate-pulse'>
                        Maison Nexus
                    </p>
                    <div className='w-48 h-px bg-white/5 relative overflow-hidden'>
                        <div className='absolute inset-0 bg-linear-to-r from-transparent via-amber-500 to-transparent -translate-x-full animate-[shimmer_2s_infinite]' />
                    </div>
                    <p className='text-slate-500 font-bold uppercase tracking-[0.2em] text-[8px]'>
                        Verifying Secure Identity
                    </p>
                </div>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes shimmer {
                        100% { transform: translateX(100%); }
                    }
                `,
                }}
            />
        </div>
    );
}
