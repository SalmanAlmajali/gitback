export type Theme = 'light' | 'dark' | 'system';

export interface Breadcrumb {
	label: string;
	href: string;
	active?: boolean;
}

export interface TableHeadColumn {
	label: string;
	key: string;
	type: 'text' | 'number' | 'boolean' | 'date' | 'link';
	hrefKey?: string;
}

export type RenderCellFunction<T> = (
	data: T,
	column: TableHeadColumn
) => React.ReactNode;

export type SignupPayload = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export type CustomResponse = {
	success?: boolean;
	message?: string;
	data?: object;
	error?: string;
}