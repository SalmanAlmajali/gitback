import { IconPencil, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import { figtree } from '../fonts';
import { Separator } from './separator';
import { RepositoriesTableRow } from '@/app/lib/repositories/definitions';
import { RenderCellFunction, TableHeadColumn } from '@/app/lib/definitions';
import { UserSelectedRepository } from '@prisma/client';
import clsx from 'clsx';

export default async function Table({
    pageName,
    query,
    currentPage,
    tableHead,
    renderCell,
    fetchFilteredFunction,
    // deleteAction,
}: {
    pageName: string;
    query: string;
    currentPage: number;
    tableHead: TableHeadColumn[];
    renderCell: RenderCellFunction<RepositoriesTableRow>
    fetchFilteredFunction: (query: string, currentPage: number) => Promise<{ data?: UserSelectedRepository[]; error?: string }>;
    // deleteAction: (id: string) => Promise<void>;
}) {
    const datas = await fetchFilteredFunction(query, currentPage);

    return (
        <div className='px-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 '>
            <div className="mt-6 flow-root overflow-x-scroll rounded-xl no-scrollbar">
                <div className="inline-block min-w-full align-middle">
                    <div className="py-2 md:pt-0">
                        <div className="md:hidden">
                            {
                                datas?.data?.map((repository, i) => (
                                    <div
                                        key={repository.id}
                                        className="mb-2 w-full rounded-md bg-white dark:bg-black p-4"
                                    >
                                        <div className="flex items-center justify-between border-b pb-4">
                                            <div>
                                                <div className="mb-2 flex items-center">
                                                    <span className='text-xl italic font-bold'>{i + 1}</span>
                                                    <Separator
                                                        orientation="vertical"
                                                        className="mx-2 data-[orientation=vertical]:h-4"
                                                    />
                                                    <p>
                                                        {renderCell(repository, tableHead[0])}
                                                    </p>
                                                </div>
                                                <p className={`${figtree.className} text-sm text-gray-500`}>{renderCell(repository, tableHead[3])}</p>
                                                <p className={`${figtree.className} text-sm text-gray-500`}>{renderCell(repository, tableHead[4])}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col w-full items-start justify-between gap-y-4 pt-4">
                                            <div className='space-y-2'>
                                                <small className={figtree.className}>Github Owner:</small>
                                                <p className="text-xl font-medium">
                                                    {renderCell(repository, tableHead[1])}
                                                </p>
                                                <small className={figtree.className}>Github Repository:</small>
                                                <p className="text-xl font-medium">{renderCell(repository, tableHead[2])}</p>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <Update id={repository.id} pageName={pageName} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <table className="hidden min-w-full text-foreground md:table">
                            <thead className="rounded-lg text-left text-sm font-normal">
                                <tr>
                                    <th scope="col" className="relative py-3 pl-6 pr-3">
                                        <span className="sr-only">No.</span>
                                    </th>
                                    {
                                        tableHead?.map((item, i) => (
                                            <th
                                                scope="col"
                                                className={`${figtree.className} px-3 py-5 font-semibold tracking-tight text-balance`}
                                                key={i}
                                            >
                                                {item?.label}
                                            </th>
                                        ))
                                    }
                                    <th scope="col" className="relative py-3 pl-6 pr-3">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    datas?.data?.map((tr, i) => (
                                        <tr
                                            key={tr.id}
                                            className="w-full py-3 text-sm last-of-type:border-none"
                                        >
                                            <td className="whitespace-nowrap px-3 py-3">
                                                {i + 1}.
                                            </td>
                                            {
                                                tableHead?.map((td, index) => {
                                                    switch (td?.type) {
                                                        case 'date':
                                                            return (
                                                                <td className={clsx("whitespace-nowrap px-3 py-3 bg-white dark:bg-neutral-950",
                                                                    {
                                                                        "rounded-l-xl": index === 0 && i === 0 && datas?.data?.length === 1,
                                                                        "rounded-tl-xl": index === 0 && i === 0,
                                                                        "rounded-r-xl": index === tableHead.length - 1 && datas?.data?.length === 1,
                                                                        "rounded-tr-xl": index === tableHead.length - 1 && i === 0,
                                                                        "rounded-bl-xl": index === 0 && i === datas?.data?.length - 1,
                                                                        "rounded-br-xl": index === tableHead?.length - 1 && i === datas?.data?.length - 1,
                                                                    }
                                                                )} key={td?.key}>
                                                                    {renderCell(tr, td)}
                                                                </td>
                                                            )

                                                        default:
                                                            return (
                                                                <td className={clsx("whitespace-nowrap px-3 py-3 bg-white dark:bg-neutral-950",
                                                                    {
                                                                        "rounded-l-xl": index === 0 && i === 0 && datas?.data?.length === 1,
                                                                        "rounded-tl-xl": index === 0 && i === 0,
                                                                        "rounded-r-xl": index === tableHead.length - 1 && datas?.data?.length === 1,
                                                                        "rounded-tr-xl": index === tableHead.length - 1 && i === 0,
                                                                        "rounded-bl-xl": index === 0 && i === datas?.data?.length - 1,
                                                                        "rounded-br-xl": index === tableHead?.length - 1 && i === datas?.data?.length - 1,
                                                                    }
                                                                )} key={td?.key}>
                                                                    {renderCell(tr, td)}
                                                                </td>
                                                            )
                                                    }
                                                })
                                            }
                                            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                                <div className="flex justify-end gap-3">
                                                    <Update id={tr?.id} pageName={pageName} />
                                                    {/* <form action={async() => {
                                                    'use server';

                                                    await deleteAction(tr?.id)
                                                }}>
                                                    <button type="submit" className="rounded-md border p-2 bg-red-600 hover:bg-red-700 transition-colors cursor-pointer">
                                                        <span className="sr-only">Delete</span>
                                                        <IconTrash className="w-5" />
                                                    </button>
                                                </form> */}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Update = ({ id, pageName }: { id: string, pageName: string }) => (
    <Link
        href={`/dashboard/${pageName.toLowerCase()}/${id}/edit`}
        className="rounded-md border p-2 bg-blue-600 hover:bg-blue-700 transition-colors"
    >
        <IconPencil className="w-5" />
    </Link>
)
