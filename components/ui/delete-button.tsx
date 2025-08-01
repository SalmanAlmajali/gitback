'use client';

import { IconLoader2, IconTrash } from "@tabler/icons-react";
import { useFormStatus } from "react-dom";

export default function DeleteButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            className="rounded-md border p-2 bg-red-600 hover:bg-red-700 transition-colors cursor-pointer disabled:bg-red-800 disabled:cursor-not-allowed"
            disabled={pending}
        >
            {pending ? (
                <IconLoader2 className="animate-spin" />
            ) : (
                <IconTrash className="w-5" />
            )}
        </button>
    );
}