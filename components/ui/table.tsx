import { IconPencil } from '@tabler/icons-react';
import Link from 'next/link';
import { Row, RowList } from 'postgres';
import { figtree } from '../fonts';
import { Separator } from './separator';
import { RepositoriesTable, RepositoriesTableRow } from '@/app/lib/repositories/definitions';
import { RenderCellFunction, TableHeadColumn } from '@/app/lib/definitions';

export default async function Table({
    pageName,
    query,
    currentPage,
    tableHead,
    renderCell,
    fetchFilteredFunction,
}: {
    pageName: string;
    query: string;
    currentPage: number;
    tableHead: TableHeadColumn[];
    renderCell: RenderCellFunction<RepositoriesTableRow>
    fetchFilteredFunction: (query: string, currentPage: number) => Promise<RepositoriesTableRow[]>;
}) {
    const datas = await fetchFilteredFunction(query, currentPage);

    console.log(datas);


    return (
        <div className="mt-6 flow-root overflow-x-scroll">
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
                                            className="px-3 py-5 font-medium"
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
                        <tbody className="bg-white dark:bg-black">
                            {
                                datas?.map((tr, i) => (
                                    <tr
                                        key={tr.id}
                                        className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                    >
                                        <td className="whitespace-nowrap px-3 py-3">
                                            {i + 1}.
                                        </td>
                                        {
                                            tableHead?.map(td => {
                                                switch (td?.type) {
                                                    case 'date':
                                                        return (
                                                            <td className="whitespace-nowrap px-3 py-3" key={td?.key}>
                                                                {renderCell(tr, td)}
                                                            </td>
                                                        )

                                                    default:
                                                        return (
                                                            <td className="whitespace-nowrap px-3 py-3" key={td?.key}>
                                                                {renderCell(tr, td)}
                                                            </td>
                                                        )
                                                }
                                            })
                                        }
                                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                            <div className="flex justify-end gap-3">
                                                <Update id={tr?.id} pageName={pageName} />
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
        className="rounded-md border p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900"
    >
        <IconPencil className="w-5" />
    </Link>
)