'use client';

import React, { useEffect, useState } from 'react'
import { PageTitle } from '../layout'
import { RepositoriesTable, RepositoryForm } from '@/app/lib/repositories/definitions';
import { Separator } from '@/components/ui/separator';
import { figtree } from '@/components/fonts';
import clsx from 'clsx';
import { mockUpUsers } from '@/app/lib/placeholders-data';
import { Button } from '@/components/ui/button';
import { IconPencil, IconSearch, IconTrash } from '@tabler/icons-react';
import CreateForm from '@/components/ui/repositories/create-form';
import EditForm from '@/components/ui/repositories/edit-form';
import { useDebouncedCallback } from 'use-debounce';

function Page() {
	const [repositories, setRepositories] = useState<RepositoriesTable[]>([])
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [repository, setRepository] = useState({
		user_id: '',
		name: '',
		github_owner: '',
		github_repo: '',
	});
	const [adding, setAdding] = useState<boolean>(false);
	const [editRepository, setEditRepository] = useState<RepositoriesTable>();

	const [search, setSearch] = useState<string>('');

	const tableHead = [
		{
			label: 'User',
			key: 'username',
			type: 'string',
		},
		{
			label: 'Email',
			key: 'email',
			type: 'string',
		},
		{
			label: 'Name',
			key: 'name',
			type: 'string',
		},
		{
			label: 'Github Owner',
			key: 'github_owner',
			type: 'string',
		},
		{
			label: 'Github Repository',
			key: 'github_repo',
			type: 'string',
		},
		{
			label: 'Created At',
			key: 'created_at',
			type: 'date',
		},
		{
			label: 'Updated At',
			key: 'updated_at',
			type: 'date',
		},
	];

	useEffect(() => {
		fetchRepos();
	}, []);

	async function fetchRepos(query = '') {
		try {
			setLoading(true);
			const url = query ? `/api/repositories?search=${encodeURIComponent(query)}` : '/api/repositories';
			const res = await fetch(url);
			if (!res.ok) {
				throw new Error('Failed to fetch repsitories');
			}
			const data = await res.json();
			setRepositories(data);
		} catch (err: any) {
			setError(err.message || 'Unknown error');
		} finally {
			setLoading(false);
		}
	}

	async function handleAdd(e: React.FormEvent) {
		e.preventDefault();
		try {
			const res = await fetch('/api/repositories', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(repository),
			});
			if (!res.ok) throw new Error('Failed to add repository');
			await res.json();

			setRepository({
				user_id: '',
				name: '',
				github_owner: '',
				github_repo: '',
			});
		} catch (err: any) {
			setError(err.message || 'Unknown error');
		} finally {
			setAdding(false);
			fetchRepos();
		}
	}

	// Edit handler (show form)
	function handleEdit(repo: RepositoriesTable) {
		setEditRepository(repo);
	}

	async function handleUpdate(e: React.FormEvent, data: RepositoryForm) {
		e.preventDefault();
		if (!data) return;
		try {
			const res = await fetch('/api/repositories', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});
			if (!res.ok) throw new Error('Failed to update repository');
			setEditRepository(undefined);
		} catch (err: any) {
			setError(err.message || 'Unknown error');
		} finally {
			fetchRepos(search);
		}
	}

	async function handleDelete(id: string) {
		if (!confirm('Are you sure you want to delete this repository?')) return;
		try {
			const res = await fetch(`/api/repositories?id=${id}`, {
				method: 'DELETE',
			});
			if (!res.ok) throw new Error('Failed to delete repository');
			fetchRepos(search); // Refresh list
		} catch (err: any) {
			setError(err.message || 'Unknown error');
		}
	}

	const handleSearch = useDebouncedCallback(async (search: string) => {
		setSearch(search);
		await fetchRepos(search);
	}, 300)

	if (loading) return <div>Loading repositories...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div >
			<PageTitle title='Repositories' />
			<div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
				<div className="relative flex flex-1 flex-shrink-0 w-full">
					<label htmlFor="search" className="sr-only">
						Search
					</label>
					<input
						type="text"
						className='peer block w-full rounded-md border py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
						placeholder="Search repositories"
						onChange={(e) => {
							handleSearch(e.target.value);
						}}
						defaultValue={search}
					/>
					<IconSearch className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
				</div>
				<Button className='py-5 px-4' onClick={() => setAdding(true)}>
					Create Repository
				</Button>
			</div>
			{
				adding && (
					<CreateForm handleAdd={handleAdd} users={mockUpUsers} setAdding={setAdding} setRepository={setRepository} />
				)
			}

			{editRepository && (
				<EditForm
					handleSubmit={handleUpdate}
					users={mockUpUsers}
					setOpen={() => setEditRepository(undefined)}
					initialData={editRepository}
					isEdit={true}
				/>
			)}

			{repositories.length === 0 ? (
				<p>No repositories found.</p>
			) : (
				<div className="mt-6 flow-root overflow-x-scroll rounded-xl no-scrollbar">
					<div className="inline-block min-w-full align-middle">
						<div className="rounded-lg bg-neutral-100 dark:bg-neutral-900 p-2 md:pt-0">
							<div className="md:hidden">
								{
									repositories?.map((repository, i) => (
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
													<button
														onClick={() => handleEdit(repository)}
														className="rounded-md border p-2 bg-blue-500 hover:bg-blue-700repositoriesansition-colors cursor-pointer"
													>
														<IconPencil className="w-5 text-white" />
													</button>
													<button
														onClick={() => handleDelete(repository.id)}
														className="rounded-md border p-2 bg-red-500 hover:bg-red-700 transition-colors cursor-pointer"
													>
														<IconTrash className="w-5 text-white" />
													</button>
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
										repositories?.map((tr, i) => (
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
																			"rounded-tl-xl": index === 0 && i === 0 && repositories?.length > 1,
																			"rounded-r-xl": index === tableHead.length - 1 && repositories.length === 1,
																			"rounded-tr-xl": index === tableHead.length - 1 && i === 0,
																			"rounded-bl-xl": index === 0 && i === repositories.length - 1,
																			"rounded-br-xl": index === tableHead?.length - 1 && i === repositories.length - 1,
																		},
																	)} key={td?.key}>
																		{new Date((tr as Record<string, string>)?.[td.key]).toLocaleDateString()}
																	</td>
																)

															default:
																return (
																	<td className={clsx("whitespace-nowrap px-3 py-3 bg-white dark:bg-neutral-950",
																		{
																			"rounded-l-xl": index === 0 && i === 0 && repositories.length === 1,
																			"rounded-tl-xl": index === 0 && i === 0,
																			"rounded-r-xl": index === tableHead.length - 1 && repositories.length === 1,
																			"rounded-tr-xl": index === tableHead.length - 1 && i === 0,
																			"rounded-bl-xl": index === 0 && i === repositories.length - 1,
																			"rounded-br-xl": index === tableHead?.length - 1 && i === repositories.length - 1,
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
														<button
															onClick={() => handleEdit(tr)}
															className="rounded-md border p-2 bg-blue-500 hover:bg-blue-700 transition-colors cursor-pointer"
														>
															<IconPencil className="w-5 text-white" />
														</button>
														<button
															onClick={() => handleDelete(tr.id)}
															className="rounded-md border p-2 bg-red-500 hover:bg-red-700 transition-colors cursor-pointer"
														>
															<IconTrash className="w-5 text-white" />
														</button>
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
			)}
			{/* <Suspense key={query + currentPage} fallback={<SkeletonTable tableHead={tableHead} />}>
				<Table
					query={query}
					currentPage={currentPage}
					pageName='Repositories'
					tableHead={tableHead}
					fetchFilteredFunction={fetchFilteredRepositoriesFromLocal}
				/>
			</Suspense> */}
		</div>
	)
}

export default Page