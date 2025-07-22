export type Theme = 'light' | 'dark' | 'system';

export interface Breadcrumb {
	label: string;
	href: string;
	active?: boolean;
}

export interface TableHeadColumn {
	label: string;
	key: string; // The property key from RepositoriesTableRow (e.g., 'fullName', 'user.name')
	type: 'text' | 'number' | 'boolean' | 'date' | 'link'; // Type of data for rendering logic
	hrefKey?: string; // Optional: for 'link' type, specifies the key for the URL
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
