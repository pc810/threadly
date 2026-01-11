import { Link, type LinkProps } from "@tanstack/react-router";
import clsx from "clsx";

export const CommunityCard = ({
	className,
	...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps) => {
	return (
		<Link
			className={clsx(
				"flex items-center text-xs max-w-max font-medium gap-1 hover:text-accent-foreground transition-colors",
				className,
			)}
			{...props}
		/>
	);
};

export const CommunityItemCard = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			className={clsx(
				"flex items-center text-xs max-w-max font-medium gap-1 hover:text-accent-foreground transition-colors",
				className,
			)}
			{...props}
		/>
	);
};
