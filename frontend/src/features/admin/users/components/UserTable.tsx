/** @format */

"use client";

import React from "react";
import type { AdminUser } from "../types";
import { Fingerprint, Search } from "lucide-react";
import UserRow from "./UserRow";

type Props = {
    users: AdminUser[];
    loading: boolean;
    page: number;
    limit: number;
    search: string;

    onToggleStatus: (u: AdminUser) => void;
    onDelete: (u: AdminUser) => void;
    onEdit: (u: AdminUser) => void;
    onPassword: (u: AdminUser) => void;

    disableActions?: boolean;

    // optional: if you want only ONE row to show status loading
    statusLoadingId?: number | null;
};

const SkeletonRow: React.FC = () => (
    <tr className='animate-pulse'>
        <td className='pl-12 py-7'>
            <div className='h-4 w-8 bg-slate-200/70 dark:bg-slate-800 rounded' />
        </td>

        <td className='px-10 py-7'>
            <div className='flex items-center gap-5'>
                <div className='w-14 h-14 bg-slate-200/70 dark:bg-slate-800 rounded-2xl' />
                <div className='h-4 w-40 bg-slate-200/70 dark:bg-slate-800 rounded-full' />
            </div>
        </td>

        <td className='px-10 py-7'>
            <div className='h-4 w-64 bg-slate-100 dark:bg-slate-800/60 rounded-full' />
        </td>

        <td className='px-10 py-7'>
            <div className='h-4 w-28 bg-slate-100 dark:bg-slate-800/60 rounded-full' />
        </td>

        <td className='px-10 py-7'>
            <div className='h-8 w-28 bg-slate-100 dark:bg-slate-800/60 rounded-2xl' />
        </td>

        <td className='px-10 py-7 text-right'>
            <div className='h-10 w-40 ml-auto bg-slate-200/70 dark:bg-slate-800 rounded-2xl' />
        </td>
    </tr>
);

const EmptyState: React.FC<{ search: string }> = ({ search }) => {
    const hasSearch = !!(search && String(search).trim().length > 0);

    return (
        <div className='py-14 px-10 text-center'>
            <div className='mx-auto w-14 h-14 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center shadow-sm dark:border-slate-800 dark:bg-slate-900/40'>
                {hasSearch ? (
                    <Search className='text-amber-600' size={22} />
                ) : (
                    <Fingerprint className='text-amber-600' size={22} />
                )}
            </div>

            <h3 className='mt-5 text-lg font-black tracking-tight text-slate-900 dark:text-white'>
                {hasSearch ? "No matching users" : "No users yet"}
            </h3>

            <p className='mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto'>
                {hasSearch
                    ? "Try a different keyword, or clear the search to see everyone."
                    : "Create the first identity to start managing access control."}
            </p>

            {hasSearch && (
                <div className='mt-4 text-[11px] uppercase tracking-[0.22em] font-black text-slate-400'>
                    Search:{" "}
                    <span className='text-amber-600'>{String(search)}</span>
                </div>
            )}
        </div>
    );
};

export default function UserTable({
    users,
    loading,
    page,
    limit,
    search,
    onToggleStatus,
    onDelete,
    onEdit,
    onPassword,
    disableActions = false,
    statusLoadingId = null,
}: Props) {
    const isEmpty = !loading && (!users || users.length === 0);

    return (
        <div className='relative rounded-4xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white/70 dark:bg-slate-900/20 shadow-sm'>
            <div className='overflow-x-auto'>
                <table className='w-full text-left'>
                    <thead className='bg-white/60 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60'>
                        <tr className='text-[10px] uppercase tracking-[0.25em] font-black text-slate-500 dark:text-slate-400'>
                            <th className='pl-12 py-5'>#</th>
                            <th className='px-10 py-5'>Identity</th>
                            <th className='px-10 py-5'>Email</th>
                            <th className='px-10 py-5'>Role</th>
                            <th className='px-10 py-5'>Status</th>
                            <th className='px-10 py-5 text-right'>Actions</th>
                        </tr>
                    </thead>

                    <tbody className='divide-y divide-slate-200/60 dark:divide-slate-800/50'>
                        {loading
                            ? Array.from({ length: 6 }).map((_, i) => (
                                  <SkeletonRow key={i} />
                              ))
                            : users.map((u, idx) => (
                                  <UserRow
                                      key={u.id}
                                      user={u}
                                      index={idx}
                                      page={page}
                                      limit={limit}
                                      onToggleStatus={onToggleStatus}
                                      onDelete={onDelete}
                                      onEdit={onEdit}
                                      onPassword={onPassword}
                                      disableActions={disableActions}
                                      statusLoading={statusLoadingId === u.id}
                                  />
                              ))}
                    </tbody>
                </table>
            </div>

            {/* ✅ Empty state OUTSIDE table area */}
            {isEmpty ? <EmptyState search={search} /> : null}

            {loading ? (
                <div className='pointer-events-none absolute inset-0 bg-white/30 dark:bg-black/10 backdrop-blur-[1px]' />
            ) : null}
        </div>
    );
}
