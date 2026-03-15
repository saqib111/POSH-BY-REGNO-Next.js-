/** @format */

"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Mail, User } from "lucide-react";
import ModalShell from "../../_ModalShell";
import CustomRoleSelect from "./CustomRoleSelect";
import type { AdminUser, UpdateUserPayload } from "../types";

type Props = {
    open: boolean;
    user: AdminUser;
    onClose: () => void;
    onConfirm: (payload: UpdateUserPayload) => void | Promise<any>;
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

export default function UpdateUserModal({
    open,
    user,
    onClose,
    onConfirm,
    isLoading = false,
}: Props) {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        setValue,
        watch,
        formState: { errors },
    } = useForm<UpdateUserPayload>({
        defaultValues: {
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });

    const roleValue = watch("role");

    useEffect(() => {
        if (open) {
            reset({
                name: user.name,
                email: user.email,
                role: user.role,
            });
        }
    }, [open, reset, user]);

    if (!open) return null;

    const submit = async (values: UpdateUserPayload) => {
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
                        field === "name" ||
                        field === "email" ||
                        field === "role"
                    ) {
                        setError(field, { type: "server", message: msg });
                    }
                });
            } else {
                setError("email", {
                    type: "server",
                    message:
                        e?.response?.data?.message || "Failed to update user.",
                });
            }
        }
    };

    return (
        <ModalShell
            open={open}
            onClose={onClose}
            title='Update User'
            subtitle='Modify identity details and role.'
        >
            <form onSubmit={handleSubmit(submit)} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                        <label className='text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400'>
                            Name
                        </label>
                        <div className='relative'>
                            <User
                                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'
                                size={18}
                            />
                            <input
                                {...register("name", {
                                    required: "Name is required",
                                    minLength: {
                                        value: 3,
                                        message: "Min 3 chars",
                                    },
                                })}
                                disabled={isLoading}
                                className='w-full rounded-2xl p-4 pl-12 text-sm outline-none transition
                                bg-white border border-slate-200 text-slate-900 placeholder-slate-400
                                focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/15
                                dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-slate-500'
                                placeholder='Full Name'
                            />
                            {errors.name?.message ? (
                                <span className='absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-rose-600 dark:text-rose-500 font-black uppercase'>
                                    {errors.name.message}
                                </span>
                            ) : null}
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <label className='text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400'>
                            Email
                        </label>
                        <div className='relative'>
                            <Mail
                                className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500'
                                size={18}
                            />
                            <input
                                {...register("email", {
                                    required: "Email is required",
                                })}
                                disabled={isLoading}
                                className='w-full rounded-2xl p-4 pl-12 text-sm outline-none transition
                                bg-white border border-slate-200 text-slate-900 placeholder-slate-400
                                focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/15
                                dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-slate-500'
                                placeholder='user@email.com'
                            />
                            {errors.email?.message ? (
                                <span className='absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-rose-600 dark:text-rose-500 font-black uppercase'>
                                    {errors.email.message}
                                </span>
                            ) : null}
                        </div>
                    </div>

                    <div className='md:col-span-2 space-y-2'>
                        <label className='text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400'>
                            Role
                        </label>

                        <input
                            type='hidden'
                            {...register("role", {
                                required: "Role is required",
                            })}
                        />

                        <CustomRoleSelect
                            value={roleValue}
                            disabled={isLoading}
                            error={errors.role?.message}
                            onChange={(val) =>
                                setValue("role", val, { shouldValidate: true })
                            }
                        />
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
                        ${isLoading ? "bg-amber-600/70 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-700"}`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className='animate-spin' />
                                Saving...
                            </>
                        ) : (
                            "Save"
                        )}
                    </button>
                </div>
            </form>
        </ModalShell>
    );
}
