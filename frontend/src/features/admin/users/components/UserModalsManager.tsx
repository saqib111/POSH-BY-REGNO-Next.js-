/** @format */

"use client";

import React, { useState } from "react";
import type {
    AdminUser,
    UpdatePasswordPayload,
    UpdateUserPayload,
} from "../types";

import ConfirmToggleModal from "../modals/ConfirmToggleModal";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import UpdateUserModal from "../modals/UpdateUserModal";
import UpdatePasswordModal from "../modals/UpdatePasswordModal";

export type ModalType = null | "toggle" | "delete" | "edit" | "password";

export function useUserModalsManager() {
    const [modal, setModal] = useState<ModalType>(null);
    const [user, setUser] = useState<AdminUser | null>(null);

    const open = (type: Exclude<ModalType, null>, u: AdminUser) => {
        setUser(u);
        setModal(type);
    };

    const close = () => {
        setModal(null);
        setUser(null);
    };

    return { modal, user, open, close };
}

type Props = {
    modal: ModalType;
    user: AdminUser | null;
    close: () => void;

    onToggleConfirm: (user: AdminUser) => void;
    toggleLoading?: boolean;

    onDeleteConfirm: (user: AdminUser) => void;
    deleteLoading?: boolean;

    onEditConfirm: (user: AdminUser, payload: UpdateUserPayload) => void;
    editLoading?: boolean;

    onPasswordConfirm: (
        user: AdminUser,
        payload: UpdatePasswordPayload,
    ) => void;
    passwordLoading?: boolean;
};

export default function UserModalsManager({
    modal,
    user,
    close,

    onToggleConfirm,
    toggleLoading = false,

    onDeleteConfirm,
    deleteLoading = false,

    onEditConfirm,
    editLoading = false,

    onPasswordConfirm,
    passwordLoading = false,
}: Props) {
    if (!user) return null;

    const nextStatus = user.status === "active" ? "suspended" : "active";

    return (
        <>
            <ConfirmToggleModal
                open={modal === "toggle"}
                nextStatus={nextStatus}
                onClose={close}
                onConfirm={() => onToggleConfirm(user)}
                isLoading={toggleLoading}
            />

            <ConfirmDeleteModal
                open={modal === "delete"}
                userName={user.name}
                onClose={close}
                onConfirm={() => onDeleteConfirm(user)}
                isLoading={deleteLoading}
            />

            <UpdateUserModal
                open={modal === "edit"}
                user={user}
                onClose={close}
                onConfirm={(payload) => onEditConfirm(user, payload)}
                isLoading={editLoading}
            />

            <UpdatePasswordModal
                open={modal === "password"}
                user={user}
                onClose={close}
                onConfirm={(payload) => onPasswordConfirm(user, payload)}
                isLoading={passwordLoading}
            />
        </>
    );
}
