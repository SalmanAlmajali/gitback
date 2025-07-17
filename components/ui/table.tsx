import { IconPencil, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import { Row, RowList } from 'postgres';
import { figtree } from '../fonts';
import { Separator } from './separator';
import clsx from 'clsx';
import { RepositoriesTable } from '@/app/lib/repositories/definitions';

export default async function Table({
    pageName,
    query,
    currentPage,
    tableHead,
    fetchFilteredFunction,
}: {
    pageName: string;
    query: string;
    currentPage: number;
    tableHead: {
        label: string,
        key: string,
        type: string,
    }[];
    fetchFilteredFunction: (query: string, currentPage: number) => Promise<RowList<RepositoriesTable[]>> | Promise<RowList<Row[]>> | Promise<RepositoriesTable[]>;
}) {
    const datas = await fetchFilteredFunction(query, currentPage);

    return (
        <div className="mt-6 flow-root overflow-x-scroll rounded-xl no-scrollbar">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-neutral-100 dark:bg-neutral-900 p-2 md:pt-0">
                    <div className="md:hidden">
                        {
                            datas?.map((repository, i) => (
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
                                                <p>{repository.name}</p>
                                            </div>
                                            <p className={`${figtree.className} text-sm text-gray-500`}>{repository.username}</p>
                                            <p className={`${figtree.className} text-sm text-gray-500`}>{repository.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col w-full items-start justify-between gap-y-4 pt-4">
                                        <div className='space-y-2'>
                                            <small className={figtree.className}>Github Owner:</small>
                                            <p className="text-xl font-medium">
                                                {repository.github_owner}
                                            </p>
                                            <small className={figtree.className}>Github Repository:</small>
                                            <p className="text-xl font-medium">{repository.github_repo}</p>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Update id={repository?.id} pageName={pageName} />
                                            <Delete id={repository?.id} pageName={pageName} />
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
                                datas?.map((tr, i) => (
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
                                                                    "rounded-l-xl": index === 0 && i === 0,
                                                                    "rounded-tl-xl": index === 0 && i === 0 && datas?.length > 1,
                                                                    "rounded-r-xl": index === tableHead.length - 1 && datas.length === 1,
                                                                    "rounded-tr-xl": index === tableHead.length - 1 && i === 0,
                                                                    "rounded-bl-xl": index === 0 && i === datas.length - 1,
                                                                    "rounded-br-xl": index === tableHead?.length - 1 && i === datas.length - 1,
                                                                },
                                                            )} key={td?.key}>
                                                                {new Date((tr as Record<string, string>)?.[td.key]).toLocaleDateString()}
                                                            </td>
                                                        )

                                                    default:
                                                        return (
                                                            <td className={clsx("whitespace-nowrap px-3 py-3 bg-white dark:bg-neutral-950",
                                                                {
                                                                    "rounded-l-xl": index === 0 && i === 0 && datas.length === 1,
                                                                    "rounded-tl-xl": index === 0 && i === 0,
                                                                    "rounded-r-xl": index === tableHead.length - 1 && datas.length === 1,
                                                                    "rounded-tr-xl": index === tableHead.length - 1 && i === 0,
                                                                    "rounded-bl-xl": index === 0 && i === datas.length - 1,
                                                                    "rounded-br-xl": index === tableHead?.length - 1 && i === datas.length - 1,
                                                                },
                                                            )} key={td?.key}>
                                                                {(tr as Record<string, string>)?.[td.key]}
                                                            </td>
                                                        )
                                                }
                                            })
                                        }
                                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                            <div className="flex justify-end gap-3">
                                                <Update id={tr?.id} pageName={pageName} />
                                                <Delete id={tr?.id} pageName={pageName} />
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
    );
}

const Update = ({ id, pageName }: { id: string, pageName: string }) => (
    <Link
        href={`/dashboard/${pageName.toLowerCase()}/${id}/edit`}
        className="rounded-md border p-2 bg-blue-500 hover:bg-blue-700 transition-colors"
    >
        <IconPencil className="w-5 text-white" />
    </Link>
)

const Delete = ({ id, pageName }: { id: string, pageName: string }) => (
    <Link
        href={`/dashboard/${pageName.toLowerCase()}/${id}/edit`}
        className="rounded-md border p-2 bg-red-500 hover:bg-red-700 transition-colors"
    >
        <IconTrash className="w-5 text-white" />
    </Link>
)