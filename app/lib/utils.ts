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