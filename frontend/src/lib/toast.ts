/** @format */
import toast from "react-hot-toast";

type ApiErrorShape = {
    response?: {
        data?: {
            message?: string;
            errors?: Record<string, string[]>;
        };
    };
    message?: string;
};

export const notify = {
    success: (message: string) =>
        toast.success(message, {
            style: {
                background: "rgba(15, 23, 42, 0.92)", // slate-900-ish
                color: "#fff",
                border: "1px solid rgba(148, 163, 184, 0.18)",
                backdropFilter: "blur(10px)",
            },
        }),

    error: (message: string) =>
        toast.error(message, {
            style: {
                background: "rgba(15, 23, 42, 0.92)",
                color: "#fff",
                border: "1px solid rgba(244, 63, 94, 0.25)",
                backdropFilter: "blur(10px)",
            },
        }),

    info: (message: string) =>
        toast(message, {
            icon: "ℹ️",
            style: {
                background: "rgba(15, 23, 42, 0.92)",
                color: "#fff",
                border: "1px solid rgba(251, 191, 36, 0.20)",
                backdropFilter: "blur(10px)",
            },
        }),

    // Perfect for mutations: shows loading then success/error
    promise: <T>(
        promise: Promise<T>,
        messages: { loading: string; success: string; error?: string },
    ) =>
        toast.promise(promise, {
            loading: messages.loading,
            success: messages.success,
            error: (err: ApiErrorShape) =>
                err?.response?.data?.message ||
                messages.error ||
                "Something went wrong",
        }),
};

// Helper for Laravel validation errors (show first message nicely)
export function toastFirstValidationError(err: unknown) {
    const e = err as ApiErrorShape;
    const errors = e?.response?.data?.errors;
    if (!errors) return;

    const firstKey = Object.keys(errors)[0];
    const firstMsg = errors[firstKey]?.[0];
    if (firstMsg) notify.error(firstMsg);
}
