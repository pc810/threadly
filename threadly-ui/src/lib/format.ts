interface FormatDateOptions extends Intl.DateTimeFormatOptions {
	showDate?: boolean; // default true
	showTime?: boolean; // default false
}

export function formatDate(
	date: Date | string | number | undefined,
	opts: FormatDateOptions = {},
) {
	if (!date) return "";

	const { showDate = true, showTime = false, ...intlOpts } = opts;

	try {
		return new Intl.DateTimeFormat("en-US", {
			month: showDate ? (intlOpts.month ?? "short") : undefined,
			day: showDate ? (intlOpts.day ?? "numeric") : undefined,
			year: showDate ? (intlOpts.year ?? "numeric") : undefined,
			hour: showTime ? (intlOpts.hour ?? "2-digit") : undefined,
			minute: showTime ? (intlOpts.minute ?? "2-digit") : undefined,
			second: showTime ? intlOpts.second : undefined,
			hour12: intlOpts.hour12 ?? true,
			...intlOpts,
		}).format(new Date(date));
	} catch (_err) {
		return "";
	}
}

export const getTwoCharacter = (str: string) => {
	const splits = str.split(" ");

	if (splits.length === 0) return str.slice(0, 2).toUpperCase();

	return splits
		.map((s) => s.at(0))
		.join()
		.toUpperCase();
};

export const capitalizeWord = (str: string) =>
	str.charAt(0).toUpperCase() + str.slice(1).toLocaleLowerCase();

export const getCommunityLink = (name: string) => {
	return `/r/${name}`;
};

export const getCommunityModLink = (name: string) => {
	return `/mod/${name}`;
};

export const getCommunityPostCreateLink = (name: string) => {
	return `/r/${name}/submit`;
};

export const formatCommunityName = (name: string) => {
	return `r/${name}`;
};

export const formatUserName = (name: string) => {
	return `u/${name}`;
};

export const getUserLink = (name: string) => {
	return `/user/${name}`;
};
