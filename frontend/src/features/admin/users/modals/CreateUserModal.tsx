/** @format */

"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, User, Mail, Lock } from "lucide-react";
import CustomRoleSelect from "./CustomRoleSelect";
import ModalShell from "../../_ModalShell";

type CreateUserFormValues = {
    name: string;
    email: string;
    role: string;
    password: string;
    password_confirmation: string;
};

type CreateUserModalProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: (values: CreateUserFormValues) => Promise<any>;
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

const CreateUserModal: React.FC<CreateUserModalProps> = ({
    open,
    onClose,
    onConfirm,
    isLoading = false,
}) => {
    const [showPass, setShowPass] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setError,
        setValue,
        formState: { errors },
    } = useForm<CreateUserFormValues>({
        defaultValues: {
            name: "",
            email: "",
            role: "employee",
            password: "",
            password_confirmation: "",
        },
    });

    const password = watch("password");
    const roleValue = watch("role");

    useEffect(() => {
        if (open) {
            reset({
                name: "",
                email: "",
                role: "employee",
                password: "",
                password_confirmation: "",
            });
            setShowPass(false);
        }
    }, [open, reset]);

    const submit = async (values: CreateUserFormValues) => {
        try {
            await onConfirm(values);
            onClose();
        } catch (err) {
            const e = err as BackendErrorShape;
            const backendErrors = e?.response?.data?.errors;

            if (backendErrors) {
                Object.keys(backendErrors).forEach((field) => {
                    const msg = backendErrors[field]?.[0];

                    if (
                        field === "name" ||
                        field === "email" ||
                        field === "role" ||
                        field === "password" ||
                        field === "password_confirmation"
                    ) {
                        setError(field, {
                            type: "server",
                            message: msg || "Invalid value",
                        });
                    }
                });
            } else {
                setError("email", {
                    type: "server",
                    message:
                        e?.response?.data?.message || "Failed to create user.",
                });
            }
        }
    };

    return (
        <ModalShell
            open={open}
            onClose={onClose}
            title='Create User'
            subtitle='Add a new identity with role and password.'
        >
            <form onSubmit={handleSubmit(submit)} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Name */}
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
                                className='
                  w-full rounded-2xl p-4 pl-12 text-sm outline-none transition
                  bg-white border border-slate-200 text-slate-900 placeholder-slate-400
                  focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/15
                  dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-slate-500
                  dark:focus:border-amber-500/50 dark:focus:bg-white/10 dark:focus:ring-amber-500/15
                '
                                placeholder='Full Name'
                            />
                            {errors.name?.message ? (
                                <span className='absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-rose-600 dark:text-rose-500 font-black uppercase'>
                                    {errors.name.message}
                                </span>
                            ) : null}
                        </div>
                    </div>

                    {/* Email */}
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
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email",
                                    },
                                })}
                                disabled={isLoading}
                                className='
                  w-full rounded-2xl p-4 pl-12 text-sm outline-none transition
                  bg-white border border-slate-200 text-slate-900 placeholder-slate-400
                  focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/15
                  dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-slate-500
                  dark:focus:border-amber-500/50 dark:focus:bg-white/10 dark:focus:ring-amber-500/15
                '
                                placeholder='user@email.com'
                            />
                            {errors.email?.message ? (
                                <span className='absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-rose-600 dark:text-rose-500 font-black uppercase'>
                                    {errors.email.message}
                                </span>
                            ) : null}
                        </div>
                    </div>

                    {/* Role */}
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

                    {/* Password */}
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
                                className='
                  w-full rounded-2xl p-4 pl-12 pr-12 text-sm outline-none transition
                  bg-white border border-slate-200 text-slate-900 placeholder-slate-400
                  focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/15
                  dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-slate-500
                  dark:focus:border-amber-500/50 dark:focus:bg-white/10 dark:focus:ring-amber-500/15
                '
                                placeholder='••••••••'
                            />

                            <button
                                type='button'
                                onClick={() => setShowPass((s) => !s)}
                                className='
                  absolute right-4 top-1/2 -translate-y-1/2 transition
                  text-slate-500 hover:text-slate-900
                  dark:text-slate-400 dark:hover:text-white
                '
                                disabled={isLoading}
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

                    {/* Confirm Password */}
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
                                        v === password ||
                                        "Passwords do not match",
                                })}
                                disabled={isLoading}
                                className='
                  w-full rounded-2xl p-4 pl-12 text-sm outline-none transition
                  bg-white border border-slate-200 text-slate-900 placeholder-slate-400
                  focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/15
                  dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-slate-500
                  dark:focus:border-amber-500/50 dark:focus:bg-white/10 dark:focus:ring-amber-500/15
                '
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

                {/* Footer Buttons */}
                <div className='flex justify-end gap-4 pt-2'>
                    <button
                        type='button'
                        onClick={onClose}
                        disabled={isLoading}
                        className='
              px-5 py-2 rounded-xl text-sm font-bold transition disabled:opacity-50
              text-slate-700 border border-slate-200 hover:bg-slate-100
              dark:text-slate-300 dark:border-white/10 dark:hover:bg-white/5
            '
                    >
                        Cancel
                    </button>

                    <button
                        type='submit'
                        disabled={isLoading}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition
              ${
                  isLoading
                      ? "bg-amber-600/70 cursor-not-allowed"
                      : "bg-amber-600 hover:bg-amber-700"
              }
              text-white
            `}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className='animate-spin' />
                                Creating…
                            </>
                        ) : (
                            "Create User"
                        )}
                    </button>
                </div>
            </form>
        </ModalShell>
    );
};

export default CreateUserModal;
