export type Theme = 'light' | 'dark' | 'system';

export interface Breadcrumb {
	label: string;
	href: string;
	active?: boolean;
}

export type TableHeadColumn = {
	label: string;
	key: string;
	type?: 'text' | 'date' | 'number' | 'custom' | string;
};

export type RenderCellFunction<T> = (
	data: T,
	column: TableHeadColumn
) => React.ReactNode;
