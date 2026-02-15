/** @format */

"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import ModalShell from "./_ModalShell";
import type { AdminUser, UpdatePasswordPayload } from "../types";

type Props = {
    open: boolean;
    user: AdminUser;
    onClose: () => void;
    onConfirm: (payload: UpdatePasswordPayload) => void | Promise<any>;
    isLoading?: boolean;
};

type BackendErrorShape = {
    response?: {
        data?: {
            message?: string;
            errors?: Record<string, string[]>;
        };
    };
};

export default function UpdatePasswordModal({
    open,
    user,
    onClose,
    onConfirm,
    isLoading = false,
}: Props) {
    const [showPass, setShowPass] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        watch,
        formState: { errors },
    } = useForm<UpdatePasswordPayload>({
        defaultValues: {
            password: "",
            password_confirmation: "",
        },
    });

    const pass = watch("password");

    useEffect(() => {
        if (open) {
            reset({ password: "", password_confirmation: "" });
            setShowPass(false);
        }
    }, [open, reset]);

    if (!open) return null;

    const submit = async (values: UpdatePasswordPayload) => {
        try {
            await onConfirm(values);
            onClose();
        } catch (err) {
            const e = err as BackendErrorShape;
            const backendErrors = e?.response?.data?.errors;

            if (backendErrors) {
                Object.keys(backendErrors).forEach((field) => {
                    const msg = backendErrors[field]?.[0] || "Invalid value";
                    if (
                        field === "password" ||
                        field === "password_confirmation"
                    ) {
                        setError(field, { type: "server", message: msg });
                    }
                });
            } else {
                setError("password", {
                    type: "server",
                    message:
                        e?.response?.data?.message ||
                        "Failed to update password.",
                });
            }
        }
    };

    return (
        <ModalShell
            open={open}
            onClose={onClose}
            title='Update Password'
            subtitle={`Set a new password for ${user.name}.`}
        >
            <form onSubmit={handleSubmit(submit)} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                        <label className='text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400'>
                            Password
                        </label>
                        <div className='relative'>
                            <Lock
                                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'
                                size={18}
                            />
                            <input
                                type={showPass ? "text" : "password"}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Min 8 characters",
                                    },
                                })}
                                disabled={isLoading}
                                className='w-full rounded-2xl p-4 pl-12 pr-12 text-sm outline-none transition
                                bg-white border border-slate-200 text-slate-900 placeholder-slate-400
                                focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/15
                                dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-slate-500'
                                placeholder='••••••••'
                            />
                            <button
                                type='button'
                                onClick={() => setShowPass((s) => !s)}
                                disabled={isLoading}
                                className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900
                                dark:text-slate-400 dark:hover:text-white'
                            >
                                {showPass ? (
                                    <EyeOff size={16} />
                                ) : (
                                    <Eye size={16} />
                                )}
                            </button>

                            {errors.password?.message ? (
                                <span className='absolute right-12 top-1/2 -translate-y-1/2 text-[9px] text-rose-600 dark:text-rose-500 font-black uppercase'>
                                    {errors.password.message}
                                </span>
                            ) : null}
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <label className='text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400'>
                            Confirm Password
                        </label>
                        <div className='relative'>
                            <Lock
                                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'
                                size={18}
                            />
                            <input
                                type={showPass ? "text" : "password"}
                                {...register("password_confirmation", {
                                    required: "Confirm password is required",
                                    validate: (v) =>
                                        v === pass || "Passwords do not match",
                                })}
                                disabled={isLoading}
                                className='w-full rounded-2xl p-4 pl-12 text-sm outline-none transition
                                bg-white border border-slate-200 text-slate-900 placeholder-slate-400
                                focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/15
                                dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-slate-500'
                                placeholder='••••••••'
                            />
                            {errors.password_confirmation?.message ? (
                                <span className='absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-rose-600 dark:text-rose-500 font-black uppercase'>
                                    {errors.password_confirmation.message}
                                </span>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className='flex justify-end gap-3'>
                    <button
                        type='button'
                        onClick={onClose}
                        disabled={isLoading}
                        className='px-5 py-2 rounded-xl text-sm font-bold transition disabled:opacity-50
                        text-slate-700 border border-slate-200 hover:bg-slate-100
                        dark:text-slate-300 dark:border-white/10 dark:hover:bg-white/5'
                    >
                        Cancel
                    </button>

                    <button
                        type='submit'
                        disabled={isLoading}
                        className={`px-5 py-2 rounded-xl text-sm font-black uppercase tracking-wider transition
                        text-white flex items-center gap-2
                        ${isLoading ? "bg-indigo-600/70 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className='animate-spin' />
                                Saving...
                            </>
                        ) : (
                            "Update"
                        )}
                    </button>
                </div>
            </form>
        </ModalShell>
    );
}
