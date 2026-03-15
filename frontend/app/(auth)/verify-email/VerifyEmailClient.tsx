/** @format */

"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Mail, KeyRound, ArrowRight, RefreshCw, Loader2 } from "lucide-react";
import api from "@/src/lib/axios/client";

type VerifyForm = {
    email: string;
    code: string;
};

type BackendErrorShape = {
    status?: boolean;
    code?: string;
    message?: string;
    email?: string;
    errors?: Record<string, string[]>;
};

export default function VerifyEmailPage() {
    const router = useRouter();
    const sp = useSearchParams();
    const emailFromQuery = sp.get("email") || "";

    const [serverMsg, setServerMsg] = useState<string>("");
    const [topError, setTopError] = useState<string>("");
    const [resending, setResending] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<VerifyForm>({
        defaultValues: { email: emailFromQuery, code: "" },
        mode: "onSubmit",
    });

    const onSubmit = async (data: VerifyForm) => {
        setServerMsg("");
        setTopError("");

        try {
            // ✅ OTP endpoints are NOT auth-protected, so no csrfCookie needed
            await api.post("/email/verify-otp", data);

            setServerMsg(
                "Email verified successfully. Redirecting to login...",
            );
            setTimeout(() => router.replace("/login"), 800);
        } catch (err: any) {
            const resData: BackendErrorShape | undefined = err?.response?.data;

            if (resData?.errors) {
                Object.keys(resData.errors).forEach((field) => {
                    setError(field as keyof VerifyForm, {
                        type: "server",
                        message: resData.errors?.[field]?.[0] || "Invalid",
                    });
                });
                return;
            }

            setTopError(
                resData?.message || "Something went wrong. Please try again.",
            );
        }
    };

    const resend = async () => {
        setServerMsg("");
        setTopError("");
        setResending(true);

        try {
            await api.post("/email/resend-otp", { email: emailFromQuery });
            setServerMsg("OTP resent. Please check your email.");
        } catch (err: any) {
            const resData: BackendErrorShape | undefined = err?.response?.data;
            setTopError(resData?.message || "Failed to resend OTP. Try again.");
        } finally {
            setResending(false);
        }
    };

    const canResend = useMemo(() => {
        return !resending && !!emailFromQuery;
    }, [resending, emailFromQuery]);

    return (
        <section className='min-h-screen bg-[#030712] flex items-center justify-center p-4 md:p-10'>
            <div className='w-full max-w-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 text-white'>
                <div className='flex items-center gap-3 mb-6'>
                    <Mail className='text-amber-500' />
                    <h1 className='text-2xl font-black uppercase tracking-widest'>
                        Verify Email
                    </h1>
                </div>

                <p className='text-slate-400 text-sm mb-8'>
                    We sent a 6-digit OTP to:{" "}
                    <span className='text-white font-bold'>
                        {emailFromQuery}
                    </span>
                </p>

                {topError ? (
                    <div className='mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm'>
                        {topError}
                    </div>
                ) : null}

                {serverMsg ? (
                    <div className='mb-6 p-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm'>
                        {serverMsg}
                    </div>
                ) : null}

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                    <div>
                        <label className='text-[10px] font-black uppercase tracking-widest text-slate-400'>
                            Email
                        </label>

                        <input
                            {...register("email", {
                                required: "Email is required",
                            })}
                            className='mt-2 w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none'
                            type='email'
                            readOnly
                        />

                        {errors.email?.message && (
                            <p className='text-rose-400 text-xs mt-1'>
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className='text-[10px] font-black uppercase tracking-widest text-slate-400'>
                            OTP Code
                        </label>

                        <div className='relative mt-2'>
                            <KeyRound
                                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'
                                size={18}
                            />
                            <input
                                {...register("code", {
                                    required: "OTP code is required",
                                    minLength: {
                                        value: 4,
                                        message: "Invalid OTP",
                                    },
                                    maxLength: {
                                        value: 10,
                                        message: "Invalid OTP",
                                    },
                                })}
                                className='w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none tracking-[0.4em]'
                                type='text'
                                placeholder='123456'
                                inputMode='numeric'
                            />
                        </div>

                        {errors.code?.message && (
                            <p className='text-rose-400 text-xs mt-1'>
                                {errors.code.message}
                            </p>
                        )}
                    </div>

                    <button
                        disabled={isSubmitting}
                        type='submit'
                        className='w-full p-4 rounded-2xl bg-amber-600 hover:bg-amber-500 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 disabled:opacity-70'
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className='animate-spin' />
                                Verifying...
                            </>
                        ) : (
                            <>
                                Verify <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className='mt-6 flex items-center justify-between'>
                    <button
                        onClick={resend}
                        disabled={!canResend}
                        className='text-[11px] font-black uppercase tracking-widest text-slate-300 hover:text-amber-400 flex items-center gap-2 disabled:opacity-50'
                    >
                        <RefreshCw
                            size={14}
                            className={resending ? "animate-spin" : ""}
                        />
                        {resending ? "Resending..." : "Resend OTP"}
                    </button>

                    <Link
                        href='/login'
                        className='text-[11px] font-black uppercase tracking-widest text-slate-300 hover:text-white'
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </section>
    );
}
