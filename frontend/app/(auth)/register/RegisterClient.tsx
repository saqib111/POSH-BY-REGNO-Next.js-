/** @format */

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
    Crown,
    Mail,
    Lock,
    User,
    Sparkles,
    ShieldCheck,
    ArrowRight,
    Loader2,
} from "lucide-react";

import { useRegister } from "@/src/features/auth/hooks";

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

type BackendErrorShape = {
    status?: boolean;
    code?: string;
    message?: string;
    email?: string;
    errors?: Record<string, string[]>;
};

const GoogleIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox='0 0 48 48' className='shrink-0'>
        <path
            fill='#FFC107'
            d='M43.611 20.083H42V20H24v8h11.303C33.303 32.658 29.016 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.047 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z'
        />
        <path
            fill='#FF3D00'
            d='M6.306 14.691l6.571 4.819C14.655 16.108 19.02 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.047 6.053 29.268 4 24 4c-7.682 0-14.373 4.325-17.694 10.691z'
        />
        <path
            fill='#4CAF50'
            d='M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.194-5.238C29.164 35.091 26.715 36 24 36c-4.996 0-9.248-3.284-10.707-7.846l-6.518 5.02C10.071 39.556 16.554 44 24 44z'
        />
        <path
            fill='#1976D2'
            d='M43.611 20.083H42V20H24v8h11.303c-.697 1.944-1.97 3.588-3.658 4.77l.003-.002 6.194 5.238C36.991 39.205 44 34 44 24c0-1.341-.138-2.651-.389-3.917z'
        />
    </svg>
);

function GlassInput({
    label,
    placeholder,
    icon,
    type = "text",
    registration,
    error,
}: {
    label: string;
    placeholder?: string;
    icon: React.ReactNode;
    type?: string;
    registration: any;
    error?: any;
}) {
    return (
        <div className='space-y-2 group'>
            <label className='text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-amber-500 transition-colors'>
                {label}
            </label>

            <div className='relative'>
                <div className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors'>
                    {icon}
                </div>

                <input
                    {...registration}
                    type={type}
                    placeholder={placeholder}
                    className='w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white text-sm outline-none focus:bg-white/10 focus:border-amber-600/50 transition-all placeholder:text-slate-700'
                />

                {error?.message && (
                    <span className='absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-rose-500 font-bold uppercase'>
                        {error.message}
                    </span>
                )}
            </div>
        </div>
    );
}

export default function RegisterClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registerMut = useRegister();
    const [googleLoading, setGoogleLoading] = useState(false);
    const [topError, setTopError] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterForm>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        },
        mode: "onSubmit",
    });

    useEffect(() => {
        const googleStatus = searchParams.get("google");

        if (googleStatus === "failed") {
            setTopError("Google authentication failed. Please try again.");
            setGoogleLoading(false);

            const params = new URLSearchParams(searchParams.toString());
            params.delete("google");
            const nextUrl = params.toString()
                ? `/register?${params.toString()}`
                : "/register";

            router.replace(nextUrl);
        }
    }, [searchParams, router]);

    const password = watch("password");

    const handleGoogleRegister = () => {
        if (googleLoading || isSubmitting) return;

        setTopError("");
        setGoogleLoading(true);
        window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/redirect`;
    };

    const onSubmit = async (data: RegisterForm) => {
        setTopError("");

        try {
            const res = await registerMut.mutateAsync(data);
            const email = res?.email || data.email;

            reset();
            router.replace(`/verify-email?email=${encodeURIComponent(email)}`);
        } catch (err: any) {
            const resData: BackendErrorShape | undefined = err?.response?.data;

            if (resData?.errors) {
                Object.keys(resData.errors).forEach((field) => {
                    setError(field as keyof RegisterForm, {
                        type: "server",
                        message: resData.errors?.[field]?.[0] || "Invalid",
                    });
                });
                return;
            }

            setTopError(
                resData?.message || "Registration failed. Please try again.",
            );
        }
    };

    return (
        <section className='min-h-screen bg-[#030712] flex items-center justify-center p-4 md:p-10 relative overflow-hidden'>
            <div className='absolute top-[-10%] left-[-10%] w-72 md:w-96 h-72 md:h-96 bg-amber-600/20 rounded-full blur-[120px] animate-pulse' />
            <div className='absolute bottom-[0%] right-[-5%] w-80 md:w-125 h-80 md:h-125 bg-indigo-600/20 rounded-full blur-[150px] animate-bounce [animation-duration:10s]' />
            <div className='absolute top-[30%] left-[20%] w-64 h-64 bg-rose-600/10 rounded-full blur-[100px] animate-pulse' />

            <div className='w-full max-w-275 min-h-150 grid grid-cols-1 lg:grid-cols-2 bg-white/3 backdrop-blur-[30px] rounded-[2.5rem] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden relative z-10 transition-all duration-1000'>
                <div className='relative hidden lg:flex flex-col justify-between p-16 bg-linear-to-br from-white/5 to-transparent'>
                    <div className='space-y-8'>
                        <div className='flex items-center gap-3 group cursor-default'>
                            <div className='p-3 bg-amber-600 rounded-2xl shadow-[0_0_20px_rgba(217,119,6,0.4)] group-hover:rotate-360 transition-transform duration-1000'>
                                <Crown className='text-white' size={24} />
                            </div>
                            <span className='text-white font-black tracking-[0.4em] uppercase text-xs'>
                                Atelier Core
                            </span>
                        </div>

                        <h2 className='text-6xl font-black text-white leading-tight uppercase italic tracking-tighter'>
                            Pure <br />
                            <span className='text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-white to-amber-600 animate-gradient-x'>
                                Digital
                            </span>{" "}
                            <br />
                            Craft.
                        </h2>

                        <div className='space-y-4'>
                            <div className='flex items-center gap-4 text-white/60 hover:text-white transition-colors duration-500 cursor-default group'>
                                <div className='w-10 h-px bg-amber-600 group-hover:w-16 transition-all duration-500' />
                                <span className='text-[10px] font-bold uppercase tracking-[0.2em]'>
                                    Encrypted Node Access
                                </span>
                            </div>
                            <div className='flex items-center gap-4 text-white/60 hover:text-white transition-colors duration-500 cursor-default group'>
                                <div className='w-10 h-px bg-amber-600 group-hover:w-16 transition-all duration-500' />
                                <span className='text-[10px] font-bold uppercase tracking-[0.2em]'>
                                    Real-time Leather Intelligence
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className='p-6 bg-white/5 rounded-4xl border border-white/10 backdrop-blur-md'>
                        <div className='flex justify-between items-center'>
                            <div>
                                <p className='text-[10px] font-black text-amber-600 uppercase tracking-widest'>
                                    Network Status
                                </p>
                                <p className='text-white font-bold text-sm italic uppercase'>
                                    Verified Secure
                                </p>
                            </div>
                            <ShieldCheck
                                size={28}
                                className='text-emerald-500 animate-pulse'
                            />
                        </div>
                    </div>
                </div>

                <div className='p-8 md:p-14 lg:p-20 flex flex-col justify-center bg-black/20'>
                    <div className='mb-10 flex flex-col items-center lg:items-start text-center lg:text-left'>
                        <Sparkles
                            className='text-amber-500 mb-4 animate-spin [animation-duration:5s]'
                            size={28}
                        />
                        <h1 className='text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-2'>
                            Initialize Account
                        </h1>
                        <p className='text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]'>
                            Authorized Registry Entrance
                        </p>
                    </div>

                    {topError ? (
                        <div className='mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200'>
                            {topError}
                        </div>
                    ) : null}

                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                        <button
                            type='button'
                            onClick={handleGoogleRegister}
                            disabled={googleLoading || isSubmitting}
                            className={`
                                relative w-full h-14 rounded-2xl
                                flex items-center justify-center gap-4
                                font-black uppercase tracking-[0.35em] text-[11px]
                                transition-all duration-500 ease-out
                                overflow-hidden group
                                ${
                                    googleLoading || isSubmitting
                                        ? "bg-white/90 text-black cursor-not-allowed shadow-inner opacity-90"
                                        : "bg-white/95 text-black shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(0,0,0,0.35)] active:scale-[0.98]"
                                }
                            `}
                        >
                            {!googleLoading && !isSubmitting && (
                                <div className='absolute inset-0 bg-linear-to-r from-transparent via-white/70 to-transparent translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-1000 ease-in-out' />
                            )}

                            {!googleLoading && !isSubmitting && (
                                <div className='absolute -inset-1 rounded-2xl bg-linear-to-r from-slate-200 to-white opacity-0 blur group-hover:opacity-40 transition duration-700' />
                            )}

                            <div className='relative flex items-center gap-4'>
                                {googleLoading ? (
                                    <>
                                        <Loader2 size={20} className='animate-spin' />
                                        <span>Connecting…</span>
                                    </>
                                ) : (
                                    <>
                                        <span className='transition-transform duration-500 group-hover:scale-110'>
                                            <GoogleIcon size={20} />
                                        </span>
                                        <span>Continue with Google</span>
                                    </>
                                )}
                            </div>
                        </button>

                        <div className='flex items-center gap-4'>
                            <div className='h-px flex-1 bg-white/10' />
                            <span className='text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]'>
                                or
                            </span>
                            <div className='h-px flex-1 bg-white/10' />
                        </div>

                        <div className='grid grid-cols-1 gap-6'>
                            <GlassInput
                                label='Identity'
                                placeholder='M. Artisan'
                                icon={<User size={18} />}
                                registration={register("name", {
                                    required: "Name required",
                                })}
                                error={errors.name}
                            />

                            <GlassInput
                                label='Secure Email'
                                placeholder='atelier@maison.com'
                                icon={<Mail size={18} />}
                                registration={register("email", {
                                    required: "Email required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email",
                                    },
                                })}
                                error={errors.email}
                            />
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <GlassInput
                                label='Access Key'
                                type='password'
                                icon={<Lock size={18} />}
                                registration={register("password", {
                                    required: "Password required",
                                    minLength: {
                                        value: 8,
                                        message: "Min 8 chars",
                                    },
                                })}
                                error={errors.password}
                            />

                            <GlassInput
                                label='Verify Key'
                                type='password'
                                icon={<Lock size={18} />}
                                registration={register("password_confirmation", {
                                    required: "Confirm password required",
                                    validate: (v) =>
                                        v === password || "Passwords do not match",
                                })}
                                error={errors.password_confirmation}
                            />
                        </div>

                        <button
                            disabled={isSubmitting}
                            type='submit'
                            className={`w-full mt-4 p-5 bg-linear-to-r from-amber-600 to-amber-500 
                                hover:from-white hover:to-white text-white hover:text-black 
                                font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl 
                                shadow-[0_10px_30px_rgba(217,119,6,0.3)] 
                                hover:shadow-[0_10px_40px_rgba(255,255,255,0.2)] 
                                transition-all duration-500 group active:scale-[0.97]
                                flex items-center justify-center gap-3
                                ${isSubmitting ? "cursor-not-allowed opacity-80" : ""}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className='animate-spin' />
                                    <span>Syncing...</span>
                                </>
                            ) : (
                                <>
                                    <span>Finalize Registry</span>
                                    <ArrowRight
                                        size={16}
                                        className='group-hover:translate-x-2 transition-transform duration-500'
                                    />
                                </>
                            )}
                        </button>
                    </form>

                    <p className='mt-10 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest'>
                        Already registered?{" "}
                        <Link
                            href='/login'
                            className='text-white hover:text-amber-500 transition-colors underline underline-offset-8 decoration-amber-600/50'
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}