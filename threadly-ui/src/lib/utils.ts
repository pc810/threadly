import { type ClassValue, clsx } from "clsx";

import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function kwId(baseId: string, index: number) {
	return `${baseId}:${index}`;
}

type DirtyCapableFormApi<TValues> = {
	getFieldMeta: (
		name: keyof TValues & string,
	) => { isDirty?: boolean } | undefined;
};

export function pickDirtyValues<TValues extends Record<string, any>>(
	values: TValues,
	formApi: DirtyCapableFormApi<TValues>,
): Partial<TValues> {
	const result: Partial<TValues> = {};

	for (const key in values) {
		if (formApi.getFieldMeta(key)?.isDirty) {
			result[key] = values[key];
		}
	}

	return result;
}
