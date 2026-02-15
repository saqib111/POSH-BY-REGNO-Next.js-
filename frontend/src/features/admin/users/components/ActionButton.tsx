/** @format */

"use client";

import React from "react";

type ActionButtonColor = "amber" | "indigo" | "rose";

type ActionButtonProps = {
    icon: React.ReactNode;
    color?: ActionButtonColor;
    onClick?: () => void;
    disabled?: boolean;
};

const ActionButton: React.FC<ActionButtonProps> = ({
    icon,
    color = "amber",
    onClick,
    disabled = false,
}) => {
    const colors: Record<ActionButtonColor, string> = {
        amber:
            "text-amber-600 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-600 hover:text-white",
        indigo:
            "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-600 hover:text-white",
        rose:
            "text-rose-600 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-600 hover:text-white",
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`
                p-2.5 rounded-xl
                transition-all duration-300
                border border-transparent
                shadow-sm hover:shadow-md
                active:scale-90
                disabled:opacity-50 disabled:cursor-not-allowed
                ${colors[color]}
            `}
        >
            {icon}
        </button>
    );
};

export default ActionButton;
