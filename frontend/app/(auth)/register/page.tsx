/** @format */

import { Suspense } from "react";
import RegisterClient from "./RegisterClient";

function RegisterFallback() {
    return (
        <section className='min-h-screen bg-[#030712] flex items-center justify-center p-4 md:p-10 relative overflow-hidden'>
            <div className='absolute top-[-10%] left-[-10%] w-72 md:w-96 h-72 md:h-96 bg-amber-600/20 rounded-full blur-[120px] animate-pulse' />
            <div className='absolute bottom-[0%] right-[-5%] w-80 md:w-125 h-80 md:h-125 bg-indigo-600/20 rounded-full blur-[150px] animate-bounce [animation-duration:10s]' />
            <div className='absolute top-[30%] left-[20%] w-64 h-64 bg-rose-600/10 rounded-full blur-[100px] animate-pulse' />

            <div className='w-full max-w-275 min-h-150 grid grid-cols-1 lg:grid-cols-2 bg-white/3 backdrop-blur-[30px] rounded-[2.5rem] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden relative z-10 transition-all duration-1000'>
                <div className='relative hidden lg:flex flex-col justify-between p-16 bg-linear-to-br from-white/5 to-transparent'>
                    <div className='space-y-8'>
                        <div className='flex items-center gap-3'>
                            <div className='p-3 bg-amber-600 rounded-2xl shadow-[0_0_20px_rgba(217,119,6,0.4)]'>
                                <div className='w-6 h-6 rounded bg-white/20 animate-pulse' />
                            </div>
                            <span className='text-white font-black tracking-[0.4em] uppercase text-xs'>
                                Atelier Core
                            </span>
                        </div>

                        <h2 className='text-6xl font-black text-white leading-tight uppercase italic tracking-tighter'>
                            Pure <br />
                            <span className='text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-white to-amber-600'>
                                Digital
                            </span>{" "}
                            <br />
                            Craft.
                        </h2>
                    </div>

                    <div className='p-6 bg-white/5 rounded-4xl border border-white/10 backdrop-blur-md'>
                        <div className='flex justify-between items-center'>
                            <div>
                                <p className='text-[10px] font-black text-amber-600 uppercase tracking-widest'>
                                    Network Status
                                </p>
                                <p className='text-white font-bold text-sm italic uppercase'>
                                    Loading...
                                </p>
                            </div>
                            <div className='w-7 h-7 rounded-full bg-emerald-500/50 animate-pulse' />
                        </div>
                    </div>
                </div>

                <div className='p-8 md:p-14 lg:p-20 flex flex-col justify-center bg-black/20'>
                    <div className='mb-10 flex flex-col items-center lg:items-start text-center lg:text-left'>
                        <div className='w-7 h-7 rounded-full bg-amber-500/60 animate-pulse mb-4' />
                        <h1 className='text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-2'>
                            Initialize Account
                        </h1>
                        <p className='text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]'>
                            Authorized Registry Entrance
                        </p>
                    </div>

                    <div className='space-y-6'>
                        <div className='h-14 w-full rounded-2xl bg-white/20 animate-pulse' />
                        <div className='flex items-center gap-4'>
                            <div className='h-px flex-1 bg-white/10' />
                            <span className='text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]'>
                                or
                            </span>
                            <div className='h-px flex-1 bg-white/10' />
                        </div>
                        <div className='h-14 w-full rounded-2xl bg-white/5 border border-white/10 animate-pulse' />
                        <div className='h-14 w-full rounded-2xl bg-white/5 border border-white/10 animate-pulse' />
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='h-14 w-full rounded-2xl bg-white/5 border border-white/10 animate-pulse' />
                            <div className='h-14 w-full rounded-2xl bg-white/5 border border-white/10 animate-pulse' />
                        </div>
                        <div className='h-14 w-full rounded-2xl bg-amber-600/40 animate-pulse' />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<RegisterFallback />}>
            <RegisterClient />
        </Suspense>
    );
}