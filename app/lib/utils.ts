import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { produce } from "immer";
import { Session } from "next-auth";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const formatDateToLocal = (
	dateStr: Date | string,
	locale: string = 'id-ID',
) => {
	const date = new Date(dateStr);
	const options: Intl.DateTimeFormatOptions = {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	};
	const formatter = new Intl.DateTimeFormat(locale, options);
	return formatter.format(date);
};


export const handleSetState = <T extends object, K extends keyof T>(
	key: K,
	value: T[K],
	setState: React.Dispatch<React.SetStateAction<T>>
) => {
	setState(prev => produce(prev, draft => {
		(draft as T)[key] = value;
	}));
};

export const getNestedValue = (obj: any, path: string) => {
	return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const checkForSession = (session: Session | null) => {
	if (!session) {
		return {
			error: 'Unauthorized: No active session found.'
		};
	}
}

export function generateYAxis(
	feedback: { month: string; count: number }[],
	targetSteps = 5
): { yAxisLabels: number[]; topLabel: number } {
	const counts = feedback.map(f => f.count);
	const max = Math.max(...counts, 0);

	if (max === 0) {
		return { yAxisLabels: [0], topLabel: 0 };
	}

	const rawStep = max / targetSteps;
	const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
	const normalizedStep = Math.ceil(rawStep / magnitude) * magnitude;

	const topLabel = Math.ceil(max / normalizedStep) * normalizedStep;
	const yAxisLabels: number[] = [];
	for (let v = topLabel; v >= 0; v -= normalizedStep) {
		yAxisLabels.push(v / (normalizedStep >= 1000 ? normalizedStep : 1));
	}

	return { yAxisLabels: yAxisLabels, topLabel };
}

export function fillMonthGaps(
	raw: {
		month: string;
		count: number;
	}[],
	monthsBack = 11
): {
	month: string;
	count: number;
}[] {
	const result: {
		month: string;
		count: number;
	}[] = [];

	const now = new Date();
	for (let i = monthsBack; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		const monthKey = d.toLocaleDateString('id-ID', {
			month: 'short',
		});
		const existing = raw.find(r => r.month === d.toISOString().slice(0, 7));

		result.push({ month: monthKey, count: existing ? existing.count : 0 });
	}
	return result;
}

export const generatePagination = (currentPage: number, totalPages: number) => {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	if (currentPage <= 3) {
		return [1, 2, 3, '...', totalPages - 1, totalPages];
	}

	if (currentPage >= totalPages - 2) {
		return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
	}

	return [
		1,
		'...',
		currentPage - 1,
		currentPage,
		currentPage + 1,
		'...',
		totalPages,
	];
};
