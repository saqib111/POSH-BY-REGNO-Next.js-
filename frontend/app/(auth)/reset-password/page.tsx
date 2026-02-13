/** @format */
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Lock, ArrowRight, Loader2 } from "lucide-react";
import { useResetPassword } from "@/src/features/auth/hooks";

type ResetForm = {
    password: string;
    password_confirmation: string;
};

type BackendErrorShape = {
    status?: boolean;
    message?: string;
    errors?: Record<string, string[]>;
};

export default function ResetPasswordPage() {
    const router = useRouter();
    const sp = useSearchParams();
    const email = sp.get("email") || "";

    const resetMut = useResetPassword();
    const [topError, setTopError] = useState("");
    const [serverMsg, setServerMsg] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ResetForm>({
        defaultValues: { password: "", password_confirmation: "" },
        mode: "onSubmit",
    });

    const password = watch("password");

    const canSubmit = useMemo(() => {
        return password.length >= 8 && !isSubmitting;
    }, [password, isSubmitting]);

    const onSubmit = async (data: ResetForm) => {
        setTopError("");
        setServerMsg("");

        try {
            await resetMut.mutateAsync({
                email,
                password: data.password,
                password_confirmation: data.password_confirmation,
            });

            setServerMsg("Password reset successful. Redirecting to login...");
            setTimeout(() => router.replace("/login"), 800);
        } catch (err: any) {
            const resData: BackendErrorShape | undefined = err?.response?.data;

            if (resData?.errors) {
                Object.keys(resData.errors).forEach((field) => {
                    setError(field as keyof ResetForm, {
                        type: "server",
                        message: resData.errors?.[field]?.[0] || "Invalid",
                    });
                });
                return;
            }

            setTopError(resData?.message || "Reset failed. Please try again.");
        }
    };

    return (
        <section className='min-h-screen bg-[#030712] flex items-center justify-center p-4 md:p-10'>
            <div className='w-full max-w-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 text-white'>
                <div className='flex items-center gap-3 mb-6'>
                    <Lock className='text-amber-500' />
                    <h1 className='text-2xl font-black uppercase tracking-widest'>
                        Reset Password
                    </h1>
                </div>

                <p className='text-slate-400 text-sm mb-6'>
                    Resetting password for:{" "}
                    <span className='text-white font-bold'>{email}</span>
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
                            New Password
                        </label>

                        <div className='relative mt-2'>
                            <Lock
                                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'
                                size={18}
                            />
                            <input
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Min 8 chars",
                                    },
                                })}
                                className='w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none'
                                type='password'
                                placeholder='••••••••'
                            />
                        </div>

                        {errors.password?.message && (
                            <p className='text-rose-400 text-xs mt-1'>
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className='text-[10px] font-black uppercase tracking-widest text-slate-400'>
                            Confirm Password
                        </label>

                        <div className='relative mt-2'>
                            <Lock
                                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'
                                size={18}
                            />
                            <input
                                {...register("password_confirmation", {
                                    required: "Confirm password is required",
                                    validate: (v) =>
                                        v === password ||
                                        "Passwords do not match",
                                })}
                                className='w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none'
                                type='password'
                                placeholder='••••••••'
                            />
                        </div>

                        {errors.password_confirmation?.message && (
                            <p className='text-rose-400 text-xs mt-1'>
                                {errors.password_confirmation.message}
                            </p>
                        )}
                    </div>

                    <button
                        disabled={!canSubmit}
                        type='submit'
                        className='w-full p-4 rounded-2xl bg-amber-600 hover:bg-amber-500 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 disabled:opacity-70'
                    >
                        {resetMut.isPending ? (
                            <>
                                <Loader2 size={16} className='animate-spin' />
                                Resetting...
                            </>
                        ) : (
                            <>
                                Reset Password <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

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
