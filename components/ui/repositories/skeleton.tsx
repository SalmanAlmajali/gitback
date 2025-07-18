// SkeletonTable.tsx
import React from "react";
import clsx from "clsx";
import { figtree } from "@/components/fonts";

export default function SkeletonTable({
    tableHead,
    skeletonRows = 5,
}: {
    tableHead: {
        label: string;
        key: string;
        type: string;
    }[];
    skeletonRows?: number;
}) {
    return (
        <div className="mt-6 flow-root overflow-x-scroll rounded-xl no-scrollbar">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-neutral-100 dark:bg-neutral-900 p-2 md:pt-0">
                    {/* Mobile Skeleton */}
                    <div className="md:hidden">
                        {Array.from({ length: skeletonRows }).map((_, i) => (
                            <div
                                key={i}
                                className="mb-2 w-full rounded-md bg-white dark:bg-black p-4 animate-pulse"
                            >
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div>
                                        <div className="mb-2 flex items-center">
                                            <span className="text-xl italic font-bold text-gray-300">{i + 1}</span>
                                            <div className="mx-2 h-4 w-px bg-gray-200/50 dark:bg-gray-600/50" />
                                            <div className="h-4 w-24 bg-gray-200/50 dark:bg-gray-600/50 rounded" />
                                        </div>
                                        <div className={`${figtree.className} h-3 w-32 bg-gray-200/50 dark:bg-gray-600/50 rounded mb-1`} />
                                        <div className={`${figtree.className} h-3 w-24 bg-gray-200/50 dark:bg-gray-600/50 rounded`} />
                                    </div>
                                </div>
                                <div className="flex flex-col w-full items-start justify-between gap-y-4 pt-4">
                                    <div className="space-y-2">
                                        <div className={`${figtree.className} h-3 w-20 bg-gray-200/50 dark:bg-gray-600/50 rounded`} />
                                        <div className="h-5 w-32 bg-gray-200/50 dark:bg-gray-600/50 rounded" />
                                        <div className={`${figtree.className} h-3 w-24 bg-gray-200/50 dark:bg-gray-600/50 rounded`} />
                                        <div className="h-5 w-32 bg-gray-200/50 dark:bg-gray-600/50 rounded" />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <div className="h-8 w-8 bg-gray-200/50 dark:bg-gray-600/50 rounded" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Desktop Skeleton */}
                    <table className="hidden min-w-full text-foreground md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="relative py-3 pl-6 pr-3">
                                    <span className="sr-only">No.</span>
                                </th>
                                {tableHead?.map((item, i) => (
                                    <th
                                        scope="col"
                                        className={`${figtree.className} px-3 py-5 font-semibold tracking-tight text-balance`}
                                        key={i}
                                    >
                                        {item?.label}
                                    </th>
                                ))}
                                <th scope="col" className="relative py-3 pl-6 pr-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: skeletonRows }).map((_, i) => (
                                <tr
                                    key={i}
                                    className="w-full py-3 text-sm last-of-type:border-none animate-pulse"
                                >
                                    <td className="whitespace-nowrap px-3 py-3">
                                        <div className="h-4 w-4 bg-gray-200/50 dark:bg-gray-600/50 rounded" />
                                    </td>
                                    {tableHead?.map((td, index) => (
                                        <td
                                            className={clsx(
                                                "whitespace-nowrap px-3 py-3 bg-white dark:bg-neutral-950",
                                                {
                                                    "rounded-l-xl": index === 0 && i === 0 && skeletonRows === 1,
                                                    "rounded-tl-xl": index === 0 && i === 0,
                                                    "rounded-r-xl": index === tableHead.length - 1 && skeletonRows === 1,
                                                    "rounded-tr-xl": index === tableHead.length - 1 && i === 0,
                                                    "rounded-bl-xl": index === 0 && i === skeletonRows - 1,
                                                    "rounded-br-xl": index === tableHead?.length - 1 && i === skeletonRows - 1,
                                                }
                                            )}
                                            key={td.key}
                                        >
                                            <div className="h-4 w-24 bg-gray-200/50 dark:bg-gray-600/50 rounded" />
                                        </td>
                                    ))}
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
                                            <div className="h-8 w-8 bg-gray-200/50 dark:bg-gray-600/50 rounded" />
                                            <div className="h-8 w-8 bg-gray-200/50 dark:bg-gray-600/50 rounded" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}