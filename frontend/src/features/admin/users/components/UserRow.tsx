/** @format */

"use client";

import { Mail } from "lucide-react";
import RoleBadge from "../badges/RoleBadge";
import StatusBadge from "../badges/StatusBadge";
import UserActions from "./UserActions";
import type { AdminUser } from "../types";

type Props = {
    user: AdminUser;
    index: number;
    page: number;
    limit: number;

    // pass handlers from parent
    onEdit: (user: AdminUser) => void;
    onDelete: (user: AdminUser) => void;
    onPassword: (user: AdminUser) => void;
    onToggleStatus: (user: AdminUser) => void;

    statusLoading?: boolean;
    disableActions?: boolean;
};

export default function UserRow({
    user,
    index,
    page,
    limit,
    onEdit,
    onDelete,
    onPassword,
    onToggleStatus,
    statusLoading = false,
    disableActions = false,
}: Props) {
    const serialNumber = (page - 1) * limit + index + 1;

    const avatarSrc =
        user.profilePic ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.name || "User",
        )}&background=random`;

    return (
        <tr className='group relative transition-all duration-300 hover:bg-amber-50/40 dark:hover:bg-amber-600/5'>
            <td className='pl-12 py-7'>
                <div className='absolute left-0 top-0 bottom-0 w-1.5 bg-amber-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center' />
                <span className='text-[11px] font-black text-slate-400 dark:text-slate-700 font-mono'>
                    {serialNumber.toLocaleString("en-US", {
                        minimumIntegerDigits: 2,
                    })}
                </span>
            </td>

            {/* Identity */}
            <td className='px-10 py-7'>
                <div className='flex items-center gap-5'>
                    <div className='w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm bg-slate-50 dark:bg-slate-900/40'>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={avatarSrc}
                            alt=''
                            className='w-full h-full object-cover'
                            loading='lazy'
                        />
                    </div>

                    <div className='flex flex-col leading-tight'>
                        <span className='text-sm font-black text-slate-900 dark:text-white uppercase italic tracking-tighter'>
                            {user.name}
                        </span>
                        <span className='text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.22em]'>
                            ID: {user.id}
                        </span>
                    </div>
                </div>
            </td>

            {/* Contact */}
            <td className='px-10 py-7'>
                <div className='flex items-center gap-3 text-slate-500 dark:text-slate-400'>
                    <Mail size={14} className='text-amber-600/70' />
                    <span className='text-xs font-bold'>{user.email}</span>
                </div>
            </td>

            {/* Role */}
            <td className='px-10 py-7 text-xs font-bold italic'>
                <RoleBadge role={user.role} />
            </td>

            {/* Status */}
            <td className='px-10 py-7'>
                <StatusBadge
                    status={user.status}
                    loading={statusLoading}
                    onToggle={() => onToggleStatus(user)}
                />
            </td>

            {/* Actions */}
            <td className='px-10 py-7 text-right'>
                <UserActions
                    onEditClick={() => onEdit(user)}
                    onPasswordClick={() => onPassword(user)}
                    onDeleteClick={() => onDelete(user)}
                    disableActions={disableActions}
                />
            </td>
        </tr>
    );
}
