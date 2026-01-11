import {
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
	differenceInMonths,
	differenceInYears,
} from "date-fns";

export function formatAgo(date: Date | string | number) {
	const d = new Date(date);

	const years = differenceInYears(new Date(), d);
	if (years >= 1) return `${years} year${years > 1 ? "s" : ""} ago`;

	const months = differenceInMonths(new Date(), d);
	if (months >= 1) return `${months} mo ago`;

	const days = differenceInDays(new Date(), d);
	if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;

	const hours = differenceInHours(new Date(), d);
	if (hours >= 1) return `${hours} hr. ago`;

	const mins = differenceInMinutes(new Date(), d);
	if (mins >= 1) return `${mins} min. ago`;

	return "just now";
}
