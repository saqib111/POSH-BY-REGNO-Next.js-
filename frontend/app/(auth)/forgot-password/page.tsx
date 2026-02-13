/** @format */
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Mail, KeyRound, ArrowRight, RefreshCw, Loader2 } from "lucide-react";
import {
    useForgotPassword,
    useVerifyResetOtp,
} from "@/src/features/auth/hooks";

type Step = "EMAIL" | "OTP";

type ForgotForm = { email: string };
type OtpForm = { code: string };

type BackendErrorShape = {
    status?: boolean;
    message?: string;
    errors?: Record<string, string[]>;
};

export default function ForgotPasswordPage() {
    const router = useRouter();
    const forgotMut = useForgotPassword();
    const verifyMut = useVerifyResetOtp();

    const [step, setStep] = useState<Step>("EMAIL");
    const [email, setEmail] = useState("");
    const [topError, setTopError] = useState("");
    const [serverMsg, setServerMsg] = useState("");

    const emailForm = useForm<ForgotForm>({
        defaultValues: { email: "" },
        mode: "onSubmit",
    });

    const otpForm = useForm<OtpForm>({
        defaultValues: { code: "" },
        mode: "onSubmit",
    });

    const onSendOtp = async (data: ForgotForm) => {
        setTopError("");
        setServerMsg("");

        try {
            const res = await forgotMut.mutateAsync({ email: data.email });
            const em = res?.email || data.email;

            setEmail(em);
            setServerMsg("OTP sent. Please check your email.");
            setStep("OTP");
        } catch (err: any) {
            const resData: BackendErrorShape | undefined = err?.response?.data;

            if (resData?.errors) {
                Object.keys(resData.errors).forEach((field) => {
                    emailForm.setError(field as keyof ForgotForm, {
                        type: "server",
                        message: resData.errors?.[field]?.[0] || "Invalid",
                    });
                });
                return;
            }
            setTopError(resData?.message || "Failed to send OTP.");
        }
    };

    const onVerifyOtp = async (data: OtpForm) => {
        setTopError("");
        setServerMsg("");

        try {
            await verifyMut.mutateAsync({ email, code: data.code });
            setServerMsg("OTP verified. Redirecting to reset password...");

            setTimeout(() => {
                router.replace(
                    `/reset-password?email=${encodeURIComponent(email)}`,
                );
            }, 600);
        } catch (err: any) {
            const resData: BackendErrorShape | undefined = err?.response?.data;

            if (resData?.errors) {
                Object.keys(resData.errors).forEach((field) => {
                    otpForm.setError(field as keyof OtpForm, {
                        type: "server",
                        message: resData.errors?.[field]?.[0] || "Invalid",
                    });
                });
                return;
            }

            setTopError(resData?.message || "OTP verification failed.");
        }
    };

    const resend = async () => {
        if (!email) return;
        setTopError("");
        setServerMsg("");

        try {
            await forgotMut.mutateAsync({ email });
            setServerMsg("OTP resent. Please check your email.");
        } catch (err: any) {
            const resData: BackendErrorShape | undefined = err?.response?.data;
            setTopError(resData?.message || "Failed to resend OTP.");
        }
    };

    const loading = forgotMut.isPending || verifyMut.isPending;

    return (
        <section className='min-h-screen bg-[#030712] flex items-center justify-center p-4 md:p-10'>
            <div className='w-full max-w-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 text-white'>
                <div className='flex items-center gap-3 mb-6'>
                    <Mail className='text-amber-500' />
                    <h1 className='text-2xl font-black uppercase tracking-widest'>
                        Forgot Password
                    </h1>
                </div>

                <p className='text-slate-400 text-sm mb-6'>
                    {step === "EMAIL"
                        ? "Enter your email and we’ll send you a reset OTP."
                        : `We sent an OTP to: `}
                    {step === "OTP" ? (
                        <span className='text-white font-bold'> {email}</span>
                    ) : null}
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

                {step === "EMAIL" ? (
                    <form
                        onSubmit={emailForm.handleSubmit(onSendOtp)}
                        className='space-y-5'
                    >
                        <div>
                            <label className='text-[10px] font-black uppercase tracking-widest text-slate-400'>
                                Email
                            </label>
                            <div className='relative mt-2'>
                                <Mail
                                    className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'
                                    size={18}
                                />
                                <input
                                    {...emailForm.register("email", {
                                        required: "Email is required",
                                    })}
                                    className='w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none'
                                    type='email'
                                    placeholder='you@example.com'
                                />
                            </div>
                            {emailForm.formState.errors.email?.message && (
                                <p className='text-rose-400 text-xs mt-1'>
                                    {emailForm.formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        <button
                            disabled={loading}
                            type='submit'
                            className='w-full p-4 rounded-2xl bg-amber-600 hover:bg-amber-500 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 disabled:opacity-70'
                        >
                            {forgotMut.isPending ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className='animate-spin'
                                    />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    Send OTP <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <form
                        onSubmit={otpForm.handleSubmit(onVerifyOtp)}
                        className='space-y-5'
                    >
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
                                    {...otpForm.register("code", {
                                        required: "OTP is required",
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

                            {otpForm.formState.errors.code?.message && (
                                <p className='text-rose-400 text-xs mt-1'>
                                    {otpForm.formState.errors.code.message}
                                </p>
                            )}
                        </div>

                        <button
                            disabled={loading}
                            type='submit'
                            className='w-full p-4 rounded-2xl bg-amber-600 hover:bg-amber-500 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 disabled:opacity-70'
                        >
                            {verifyMut.isPending ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className='animate-spin'
                                    />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Verify OTP <ArrowRight size={16} />
                                </>
                            )}
                        </button>

                        <div className='flex items-center justify-between pt-2'>
                            <button
                                type='button'
                                onClick={resend}
                                disabled={forgotMut.isPending}
                                className='text-[11px] font-black uppercase tracking-widest text-slate-300 hover:text-amber-400 flex items-center gap-2 disabled:opacity-50'
                            >
                                <RefreshCw
                                    size={14}
                                    className={
                                        forgotMut.isPending
                                            ? "animate-spin"
                                            : ""
                                    }
                                />
                                Resend OTP
                            </button>

                            <button
                                type='button'
                                onClick={() => {
                                    setStep("EMAIL");
                                    setServerMsg("");
                                    setTopError("");
                                    otpForm.reset();
                                }}
                                className='text-[11px] font-black uppercase tracking-widest text-slate-300 hover:text-white'
                            >
                                Change Email
                            </button>
                        </div>
                    </form>
                )}

                <div className='mt-8 flex justify-between'>
                    <Link
                        href='/login'
                        className='text-[11px] font-black uppercase tracking-widest text-slate-300 hover:text-white'
                    >
                        Back to Login
                    </Link>

                    <Link
                        href='/'
                        className='text-[11px] font-black uppercase tracking-widest text-slate-300 hover:text-white'
                    >
                        Back to Store
                    </Link>
                </div>
            </div>
        </section>
    );
}
