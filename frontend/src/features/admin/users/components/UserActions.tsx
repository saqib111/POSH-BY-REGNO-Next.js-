/** @format */

"use client";

import { Edit3, Key, Trash2 } from "lucide-react";
import ActionButton from "./ActionButton";

type UserActionsProps = {
    onEditClick: () => void;
    onPasswordClick: () => void;
    onDeleteClick: () => void;
    disableActions?: boolean;
};

export default function UserActions({
    onEditClick,
    onPasswordClick,
    onDeleteClick,
    disableActions = false,
}: UserActionsProps) {
    return (
        <div className='flex justify-end gap-2.5'>
            <ActionButton
                icon={<Edit3 size={15} />}
                onClick={onEditClick}
                disabled={disableActions}
            />

            <ActionButton
                icon={<Key size={15} />}
                onClick={onPasswordClick}
                color='indigo'
                disabled={disableActions}
            />

            <ActionButton
                icon={<Trash2 size={15} />}
                color='rose'
                onClick={onDeleteClick}
                disabled={disableActions}
            />
        </div>
    );
}
