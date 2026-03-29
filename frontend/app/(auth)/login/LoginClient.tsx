/** @format */

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    Crown,
    Mail,
    Lock,
    ArrowRight,
    Fingerprint,
    Loader2,
    ShieldCheck,
} from "lucide-react";

import { useLogin, useMe } from "@/src/features/auth/hooks";

function GoogleIcon({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox='0 0 48 48'>
            <path
                fill='#EA4335'
                d='M24 9.5c3.54 0 6.71 1.23 9.21 3.63l6.85-6.85C35.9 2.42 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'
            />
            <path
                fill='#4285F4'
                d='M46.1 24.5c0-1.73-.15-3.39-.43-5H24v9.47h12.47c-.54 2.9-2.18 5.36-4.64 7.04l7.5 5.82C43.82 37.36 46.1 31.45 46.1 24.5z'
            />
            <path
                fill='#FBBC05'
                d='M10.54 28.41c-.48-1.45-.76-2.99-.76-4.41s.27-2.96.76-4.41l-7.98-6.19C.92 16.23 0 19.05 0 24c0 4.95.92 7.77 2.56 10.6l7.98-6.19z'
            />
            <path
                fill='#34A853'
                d='M24 48c6.48 0 11.93-2.13 15.9-5.81l-7.5-5.82c-2.07 1.39-4.71 2.21-8.4 2.21-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'
            />
        </svg>
    );
}

type BackendErrorShape = {
    status?: boolean;
    code?: string;
    message?: string;
    email?: string;
    errors?: Record<string, string[]>;
};

type LoginForm = {
    email: string;
    password: string;
};

export default function LoginClient() {
    const router = useRouter();
    const loginMut = useLogin();
    const meQuery = useMe();
    const searchParams = useSearchParams();

    const [googleLoading, setGoogleLoading] = useState(false);
    const [topError, setTopError] = useState<string>("");

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<LoginForm>({
        mode: "onSubmit",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const isSubmitting = loginMut.isPending;

    useEffect(() => {
        const justLoggedOut = localStorage.getItem("just_logged_out") === "1";

        if (justLoggedOut) {
            setTimeout(() => localStorage.removeItem("just_logged_out"), 1000);
            return;
        }

        const user = meQuery.data?.user;

        if (meQuery.isLoading) return;
        if (!user) return;

        if (user.role === "admin" || user.role === "manager") {
            router.replace("/admin/dashboard");
        } else {
            router.replace("/");
        }
    }, [meQuery.isLoading, meQuery.data, router]);

    useEffect(() => {
        const googleStatus = searchParams.get("google");

        if (googleStatus === "failed") {
            setTopError("Google login failed. Please try again.");
            setGoogleLoading(false);

            const params = new URLSearchParams(searchParams.toString());
            params.delete("google");
            const nextUrl = params.toString() ? `/login?${params.toString()}` : "/login";
            router.replace(nextUrl);
        }
    }, [searchParams, router]);

    const handleGoogleLogin = () => {
        setTopError("");
        setGoogleLoading(true);
        window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/redirect`;
    };

    const onSubmit = async (values: LoginForm) => {
        setTopError("");

        try {
            await loginMut.mutateAsync({
                email: values.email,
                password: values.password,
            });

            const res = await meQuery.refetch();
            const user = res.data?.user;

            if (user?.role === "admin" || user?.role === "manager") {
                router.replace("/admin/dashboard");
            } else {
                router.replace("/");
            }
        } catch (err: any) {
            const resData: BackendErrorShape | undefined = err?.response?.data;
            const status: number | undefined = err?.response?.status;

            if (resData?.code === "ACCOUNT_SUSPENDED") {
                router.replace("/suspended-user");
                return;
            }

            if (
                status === 403 &&
                (resData?.code === "EMAIL_NOT_VERIFIED" ||
                    (resData?.message || "").toLowerCase().includes("verify"))
            ) {
                const email = resData?.email || values.email;
                router.replace(`/verify-email?email=${encodeURIComponent(email)}`);
                return;
            }

            if (resData?.errors) {
                const eobj = resData.errors;

                if (eobj.email?.[0]) {
                    setError("email", {
                        type: "server",
                        message: eobj.email[0],
                    });
                }

                if (eobj.password?.[0]) {
                    setError("password", {
                        type: "server",
                        message: eobj.password[0],
                    });
                }

                const otherKeys = Object.keys(eobj).filter(
                    (k) => k !== "email" && k !== "password",
                );

                if (otherKeys.length) {
                    setTopError(eobj[otherKeys[0]]?.[0] || "Validation failed.");
                }

                return;
            }

            setTopError(resData?.message || "Login failed. Please try again.");
        }
    };

    return (
        <section className='min-h-screen bg-[#030712] flex items-center justify-center p-4 md:p-10 relative overflow-hidden'>
            <div className='absolute top-[-10%] right-[-10%] w-72 md:w-96 h-72 md:h-96 bg-amber-600/20 rounded-full blur-[120px] animate-pulse' />
            <div className='absolute bottom-[0%] left-[-5%] w-80 md:w-lg h-80 md:h-128 bg-indigo-600/20 rounded-full blur-[150px] animate-bounce [animation-duration:12s]' />
            <div className='absolute top-[30%] right-[20%] w-64 h-64 bg-emerald-600/10 rounded-full blur-[100px] animate-pulse' />

            <div className='w-full max-w-275 min-h-137.5 grid grid-cols-1 lg:grid-cols-2 bg-white/3 backdrop-blur-[30px] rounded-[2.5rem] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden relative z-10'>
                <div className='relative hidden lg:flex flex-col justify-between p-16 bg-linear-to-br from-white/5 to-transparent border-r border-white/5'>
                    <div className='space-y-8'>
                        <div className='flex items-center gap-3 group'>
                            <div className='p-3 bg-amber-600 rounded-2xl shadow-[0_0_20px_rgba(217,119,6,0.4)] transition-transform duration-700 group-hover:scale-110'>
                                <Crown className='text-white' size={24} />
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
                                Re-authenticating administrative access...
                            </p>
                        </div>
                    </div>

                    <div className='space-y-6'>
                        <div className='flex items-center gap-4 group cursor-default'>
                            <div className='w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-amber-600 transition-colors'>
                                <Fingerprint className='text-amber-600' size={20} />
                            </div>
                            <div>
                                <p className='text-white text-[10px] font-black uppercase tracking-widest'>
                                    Biometric Link
                                </p>
                                <p className='text-slate-500 text-[9px] uppercase'>
                                    Active Status
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='p-8 md:p-14 lg:p-20 flex flex-col justify-center bg-black/20'>
                    <div className='mb-10 flex flex-col items-center lg:items-start text-center lg:text-left'>
                        <div className='w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 lg:hidden'>
                            <Crown className='text-amber-600' size={28} />
                        </div>

                        <h1 className='text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-2'>
                            Login
                        </h1>
                        <p className='text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]'>
                            Access Private Collection
                        </p>

                        {topError ? (
                            <div className='mt-5 w-full rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-left'>
                                <p className='text-[11px] font-black uppercase tracking-wider text-rose-200'>
                                    {topError}
                                </p>
                            </div>
                        ) : null}
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-7'>
                        <div className='space-y-2 group'>
                            <label className='text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-amber-500 transition-colors'>
                                Administrative Email
                            </label>

                            <div className='relative'>
                                <Mail
                                    className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors'
                                    size={18}
                                />
                                <input
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^\S+@\S+\.\S+$/,
                                            message: "Enter a valid email",
                                        },
                                    })}
                                    className='w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white text-sm outline-none focus:bg-white/10 focus:border-amber-600/50 transition-all placeholder:text-slate-700'
                                    type='email'
                                    placeholder='Enter Email'
                                    autoComplete='email'
                                />
                                {errors.email?.message ? (
                                    <span className='absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-rose-500 font-black uppercase tracking-tighter'>
                                        {errors.email.message}
                                    </span>
                                ) : null}
                            </div>
                        </div>

                        <div className='space-y-2 group'>
                            <div className='flex justify-between items-center px-1'>
                                <label className='text-[9px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-amber-500 transition-colors'>
                                    Access Key
                                </label>

                                <Link
                                    href='/forgot-password'
                                    className='text-[8px] text-slate-600 font-black uppercase hover:text-amber-500 transition-colors'
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            <div className='relative'>
                                <Lock
                                    className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-600 transition-colors'
                                    size={18}
                                />
                                <input
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Minimum 6 characters",
                                        },
                                    })}
                                    className='w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white text-sm outline-none focus:bg-white/10 focus:border-amber-600/50 transition-all placeholder:text-slate-700'
                                    type='password'
                                    placeholder='••••••••'
                                    autoComplete='current-password'
                                />
                                {errors.password?.message ? (
                                    <span className='absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-rose-500 font-black uppercase tracking-tighter'>
                                        {errors.password.message}
                                    </span>
                                ) : null}
                            </div>
                        </div>

                        <button
                            disabled={isSubmitting}
                            type='submit'
                            className={`w-full mt-4 p-5 rounded-2xl shadow-[0_10px_30px_rgba(217,119,6,0.3)]
                font-black uppercase tracking-[0.4em] text-[10px]
                flex items-center justify-center gap-3 transition-all duration-500
                ${
                    isSubmitting
                        ? "bg-amber-600/70 text-white cursor-not-allowed"
                        : "bg-linear-to-r from-amber-600 to-amber-500 hover:from-white hover:to-white text-white hover:text-black hover:shadow-[0_10px_40px_rgba(255,255,255,0.2)]"
                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className='animate-spin' />
                                    <span>Authenticating…</span>
                                </>
                            ) : (
                                <>
                                    <span>Authorize Access</span>
                                    <ArrowRight
                                        size={16}
                                        className='transition-transform duration-500 group-hover:translate-x-2'
                                    />
                                </>
                            )}
                        </button>

                        <div className='relative my-6 group'>
                            <div className='absolute inset-0 flex items-center'>
                                <div className='w-full border-t border-white/10 group-hover:border-white/20 transition-colors' />
                            </div>
                            <div className='relative flex justify-center'>
                                <span className='bg-black px-4 text-[9px] uppercase tracking-[0.4em] text-slate-500 font-black'>
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <button
                            type='button'
                            onClick={handleGoogleLogin}
                            disabled={googleLoading}
                            className={`
                relative w-full h-14 rounded-2xl
                flex items-center justify-center gap-4
                font-black uppercase tracking-[0.35em] text-[11px]
                transition-all duration-500 ease-out
                overflow-hidden group
                ${
                    googleLoading
                        ? "bg-white/90 text-black cursor-not-allowed shadow-inner"
                        : "bg-white/95 text-black shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(0,0,0,0.35)] active:scale-[0.98]"
                }
              `}
                        >
                            {!googleLoading ? (
                                <>
                                    <div
                                        className='
                      absolute inset-0
                      bg-linear-to-r from-transparent via-white/70 to-transparent
                      translate-x-[-120%]
                      group-hover:translate-x-[120%]
                      transition-transform duration-1000 ease-in-out
                    '
                                    />
                                    <div
                                        className='
                      absolute -inset-1 rounded-2xl
                      bg-linear-to-r from-slate-200 to-white
                      opacity-0 blur
                      group-hover:opacity-40
                      transition duration-700
                    '
                                    />
                                </>
                            ) : null}

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
                    </form>

                    <div className='mt-12 text-center'>
                        <p className='text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]'>
                            New Personnel?{" "}
                            <Link
                                href='/register'
                                className='text-white hover:text-amber-500 transition-colors underline underline-offset-8 decoration-amber-600/50'
                            >
                                Create Identity
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <div className='absolute bottom-6 flex gap-6 opacity-30'>
                <div className='flex items-center gap-2'>
                    <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
                    <span className='text-[8px] text-white font-black uppercase tracking-[0.2em]'>
                        System Online
                    </span>
                </div>
                <div className='flex items-center gap-2'>
                    <ShieldCheck size={10} className='text-amber-500' />
                    <span className='text-[8px] text-white font-black uppercase tracking-[0.2em]'>
                        SSL Encrypted
                    </span>
                </div>
            </div>
        </section>
    );
}