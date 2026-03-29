/** @format */

import { Suspense } from "react";
import LoginClient from "./LoginClient";

function LoginFallback() {
    return (
        <section className='min-h-screen bg-[#030712] flex items-center justify-center p-4 md:p-10 relative overflow-hidden'>
            <div className='absolute top-[-10%] right-[-10%] w-72 md:w-96 h-72 md:h-96 bg-amber-600/20 rounded-full blur-[120px] animate-pulse' />
            <div className='absolute bottom-[0%] left-[-5%] w-80 md:w-lg h-80 md:h-128 bg-indigo-600/20 rounded-full blur-[150px] animate-bounce [animation-duration:12s]' />
            <div className='absolute top-[30%] right-[20%] w-64 h-64 bg-emerald-600/10 rounded-full blur-[100px] animate-pulse' />

            <div className='w-full max-w-275 min-h-137.5 grid grid-cols-1 lg:grid-cols-2 bg-white/3 backdrop-blur-[30px] rounded-[2.5rem] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden relative z-10'>
                <div className='relative hidden lg:flex flex-col justify-between p-16 bg-linear-to-br from-white/5 to-transparent border-r border-white/5'>
                    <div className='space-y-8'>
                        <div className='flex items-center gap-3 group'>
                            <div className='p-3 bg-amber-600 rounded-2xl shadow-[0_0_20px_rgba(217,119,6,0.4)]'>
                                <div className='w-6 h-6 rounded bg-white/20 animate-pulse' />
                            </div>
                            <span className='text-white font-black tracking-[0.4em] uppercase text-[10px]'>
                                Maison Nexus
                            </span>
                        </div>

                        <div className='space-y-2'>
                            <h2 className='text-5xl font-black text-white leading-tight uppercase italic tracking-tighter'>
                                Welcome <br />
                                <span className='text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-white to-amber-600'>
                                    Back.
                                </span>
                            </h2>
                            <p className='text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-4'>
                                Loading secure access...
                            </p>
                        </div>
                    </div>
                </div>

                <div className='p-8 md:p-14 lg:p-20 flex flex-col justify-center bg-black/20'>
                    <div className='mb-10 flex flex-col items-center lg:items-start text-center lg:text-left'>
                        <div className='w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 lg:hidden'>
                            <div className='w-8 h-8 rounded-full bg-amber-600/60 animate-pulse' />
                        </div>

                        <h1 className='text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-2'>
                            Login
                        </h1>
                        <p className='text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]'>
                            Access Private Collection
                        </p>
                    </div>

                    <div className='space-y-7'>
                        <div className='space-y-2'>
                            <div className='h-3 w-32 bg-white/10 rounded animate-pulse' />
                            <div className='h-14 w-full bg-white/5 border border-white/10 rounded-2xl animate-pulse' />
                        </div>

                        <div className='space-y-2'>
                            <div className='h-3 w-24 bg-white/10 rounded animate-pulse' />
                            <div className='h-14 w-full bg-white/5 border border-white/10 rounded-2xl animate-pulse' />
                        </div>

                        <div className='h-14 w-full rounded-2xl bg-amber-600/40 animate-pulse' />
                        <div className='h-14 w-full rounded-2xl bg-white/20 animate-pulse' />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginFallback />}>
            <LoginClient />
        </Suspense>
    );
}