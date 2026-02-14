/** @format */

"use client";

import React from "react";
import { Fingerprint, Search } from "lucide-react";
import UserRow from "./UserRow";
import type { AdminUser } from "../types";

const SkeletonRow = () => (
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

const EmptyState = ({ search }: { search: string }) => {
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
}: {
    users: AdminUser[];
    loading: boolean;
    page: number;
    limit: number;
    search: string;
}) {
    const isEmpty = !loading && (!users || users.length === 0);

    return (
        <div
            className='
        relative
        bg-white dark:bg-[#0B1120]
        rounded-3xl
        border border-slate-200 dark:border-slate-800/70
        overflow-hidden
        shadow-sm
        transition-all duration-500
        hover:shadow-xl hover:shadow-slate-200/60
        dark:hover:shadow-black/30
      '
        >
            <div className='h-1.5 bg-linear-to-r from-amber-600/50 via-amber-600/10 to-transparent dark:from-amber-600/40' />

            <div className='overflow-x-auto'>
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800'>
                            <th className='pl-12 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400 w-24'>
                                Pos.
                            </th>
                            <th className='px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400'>
                                Identity
                            </th>
                            <th className='px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400'>
                                Contact
                            </th>
                            <th className='px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400'>
                                Role
                            </th>
                            <th className='px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400'>
                                Status
                            </th>
                            <th className='px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400 text-right'>
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className='divide-y divide-slate-200/60 dark:divide-slate-800/50'>
                        {loading
                            ? [...Array(6)].map((_, i) => (
                                  <SkeletonRow key={i} />
                              ))
                            : users.map((user, index) => (
                                  <UserRow
                                      key={user.id}
                                      user={user}
                                      index={index}
                                      page={page}
                                      limit={limit}
                                  />
                              ))}
                    </tbody>
                </table>

                {isEmpty && <EmptyState search={search} />}
            </div>

            {loading && (
                <div className='pointer-events-none absolute inset-0 bg-white/30 dark:bg-black/10 backdrop-blur-[1px]' />
            )}
        </div>
    );
}
