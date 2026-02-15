/** @format */

"use client";

import React, { useMemo, useState } from "react";
import {
    Fingerprint,
    Plus,
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import RowsPerPageDropdown from "@/src/features/admin/RowsPerPageDropdown";
import UserTable from "@/src/features/admin/users/components/UserTable";
import UserModalsManager, {
    useUserModalsManager,
} from "@/src/features/admin/users/components/UserModalsManager";
import CreateUserModal from "@/src/features/admin/users/modals/CreateUserModal";

import { usersApi } from "@/src/features/admin/users/api";
import type { AdminUser } from "@/src/features/admin/users/types";

import { useCreateUserMutation } from "@/src/features/admin/users/hooks/useCreateUserMutation";
import { useUserStatusMutation } from "@/src/features/admin/users/hooks/useUserStatusMutation";
import { useDeleteUserMutation } from "@/src/features/admin/users/hooks/useDeleteUserMutation";
import { useUpdateUserMutation } from "@/src/features/admin/users/hooks/useUpdateUserMutation";
import { useUpdateUserPasswordMutation } from "@/src/features/admin/users/hooks/useUpdateUserPasswordMutation";

const ManageUserPage = () => {
    // UI
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // modals
    const modals = useUserModalsManager();
    const [createOpen, setCreateOpen] = useState(false);

    // mutations
    const createMutation = useCreateUserMutation({
        onClose: () => setCreateOpen(false),
    });
    const statusMutation = useUserStatusMutation({ onClose: modals.close });
    const deleteMutation = useDeleteUserMutation({ onClose: modals.close });
    const updateMutation = useUpdateUserMutation({ onClose: modals.close });
    const passwordMutation = useUpdateUserPasswordMutation({
        onClose: modals.close,
    });

    // debounce search
    const debounceMs = 500;
    const debouncedSetter = useMemo(() => {
        let t: ReturnType<typeof setTimeout> | undefined;
        return (value: string) => {
            if (t) clearTimeout(t);
            t = setTimeout(() => setSearch(value), debounceMs);
        };
    }, []);

    const { data, isLoading, isFetching, isError, error } = useQuery({
        queryKey: ["adminUsers", page, limit, search] as const,
        queryFn: ({ queryKey }) => {
            const [_k, p, l, s] = queryKey;
            return usersApi.list({ page: p, limit: l, search: s });
        },
        placeholderData: (prev) => prev,
        staleTime: 30 * 1000,
    });

    const users = data?.users ?? [];
    const totalPages = data?.totalPages ?? 1;
    const totalUsers = data?.totalUsers ?? 0;
    const loading = isLoading || isFetching;

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
    };

    const disableActions =
        statusMutation.isPending ||
        deleteMutation.isPending ||
        updateMutation.isPending ||
        passwordMutation.isPending;

    return (
        <div className='space-y-10'>
            {/* Header */}
            <div className='flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8'>
                <div className='space-y-2'>
                    <div className='flex items-center gap-3'>
                        <Fingerprint
                            size={18}
                            className='text-amber-600 animate-pulse'
                        />
                        <span className='text-[10px] font-black uppercase tracking-[0.6em] text-slate-500 dark:text-slate-400'>
                            Security & Access Control
                        </span>
                    </div>

                    <h1 className='text-5xl lg:text-7xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white leading-none'>
                        User{" "}
                        <span className='font-thin text-slate-300 dark:text-slate-800 italic underline decoration-amber-600/30'>
                            Registry
                        </span>
                    </h1>
                </div>

                <div className='flex flex-wrap items-center gap-4 w-full xl:w-auto'>
                    <RowsPerPageDropdown
                        limit={limit}
                        setLimit={handleLimitChange}
                    />

                    <div className='relative flex-1 md:w-80 group'>
                        <Search
                            className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors'
                            size={18}
                        />
                        <input
                            type='text'
                            placeholder='QUERY REGISTRY...'
                            value={searchInput}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSearchInput(val);
                                setPage(1);
                                debouncedSetter(val);
                            }}
                            className='
                w-full rounded-2xl py-4 pl-14 pr-6
                text-[11px] font-bold uppercase tracking-[0.2em]
                bg-white text-slate-900 border border-slate-200
                placeholder:text-slate-400
                focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 outline-none transition-all
                shadow-sm
                dark:bg-slate-900/50 dark:text-white dark:border-slate-800 dark:placeholder:text-slate-500
              '
                        />
                    </div>

                    <div className='group pt-1'>
                        <button
                            type='button'
                            onClick={() => setCreateOpen(true)}
                            className='
                flex items-center gap-3
                bg-slate-900 text-white
                dark:bg-white dark:text-black
                px-8 py-4 rounded-2xl
                font-black text-[10px] uppercase tracking-widest
                transition-all duration-300
                shadow-2xl
                hover:-translate-y-1
                hover:bg-amber-600
                dark:hover:bg-amber-600 dark:hover:text-white
              '
                        >
                            <Plus size={20} /> New Identity
                        </button>
                    </div>
                </div>
            </div>

            {/* Error */}
            {isError && (
                <div className='p-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-200 text-sm'>
                    Failed to load users.{" "}
                    <span className='opacity-80'>
                        {(error as any)?.response?.data?.message ||
                            (error as any)?.message ||
                            "Please try again."}
                    </span>
                </div>
            )}

            {/* Table */}
            <UserTable
                users={users}
                loading={loading}
                page={page}
                limit={limit}
                search={search}
                onToggleStatus={(u: AdminUser) => modals.open("toggle", u)}
                onDelete={(u: AdminUser) => modals.open("delete", u)}
                onEdit={(u: AdminUser) => modals.open("edit", u)}
                onPassword={(u: AdminUser) => modals.open("password", u)}
                disableActions={disableActions}
                statusLoadingId={null}
            />

            {/* Modals (single place) */}
            <UserModalsManager
                modal={modals.modal}
                user={modals.user}
                close={modals.close}
                toggleLoading={statusMutation.isPending}
                deleteLoading={deleteMutation.isPending}
                editLoading={updateMutation.isPending}
                passwordLoading={passwordMutation.isPending}
                onToggleConfirm={(u) =>
                    statusMutation.mutate({
                        userId: u.id,
                        nextStatus:
                            u.status === "active" ? "suspended" : "active",
                    })
                }
                onDeleteConfirm={(u) => deleteMutation.mutate({ userId: u.id })}
                onEditConfirm={(u, payload) =>
                    updateMutation.mutate({ userId: u.id, payload })
                }
                onPasswordConfirm={(u, payload) =>
                    passwordMutation.mutate({ userId: u.id, payload })
                }
            />

            {/* Pagination */}
            <div className='px-6 md:px-10 py-8 border border-slate-200 dark:border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/70 dark:bg-slate-900/20 rounded-3xl shadow-sm'>
                <span className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400'>
                    {Number(totalUsers || 0).toLocaleString()} Members Indexed
                    in Intelligence Stream
                </span>

                <div className='flex items-center gap-3'>
                    <NavButton
                        onClick={() => setPage(1)}
                        disabled={page === 1}
                        icon={<ChevronsLeft size={18} />}
                    />
                    <NavButton
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        icon={<ChevronLeft size={18} />}
                    />

                    <div className='relative group'>
                        <div className='absolute -inset-1 bg-amber-600/30 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-700' />
                        <div className='relative h-12 w-16 flex items-center justify-center bg-slate-900 dark:bg-white rounded-2xl shadow-2xl'>
                            <span className='text-xs font-black text-white dark:text-black'>
                                {page}
                            </span>
                        </div>
                    </div>

                    <NavButton
                        onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                        icon={<ChevronRight size={18} />}
                    />
                    <NavButton
                        onClick={() => setPage(totalPages)}
                        disabled={page === totalPages}
                        icon={<ChevronsRight size={18} />}
                    />
                </div>
            </div>

            {/* Create Modal */}
            <CreateUserModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onConfirm={(payload: any) =>
                    createMutation.mutateAsync(payload)
                }
                isLoading={createMutation.isPending}
            />
        </div>
    );
};

const NavButton = ({
    onClick,
    disabled,
    icon,
}: {
    onClick: () => void;
    disabled: boolean;
    icon: React.ReactNode;
}) => (
    <button
        type='button'
        onClick={onClick}
        disabled={disabled}
        className='
      p-3.5 rounded-2xl
      bg-white text-slate-700 border border-slate-200
      hover:border-amber-600 hover:text-amber-600
      transition-all shadow-sm
      disabled:opacity-20 disabled:cursor-not-allowed
      dark:bg-slate-800 dark:text-white dark:border-slate-700
    '
    >
        {icon}
    </button>
);

export default ManageUserPage;
