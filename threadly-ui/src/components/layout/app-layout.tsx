import clsx from "clsx";
import type { ComponentProps } from "react";
import SimpleBar from "simplebar-react";

export const AppLayout = ({ className, ...props }: ComponentProps<"div">) => (
	<div
		className={clsx(
			"flex-1 mx-auto grid gap-6",
			"px-6",
			// "grid-cols-1 has-[>:first-child:nth-last-child(2)]:grid-cols-2"
			"grid-cols-1 w-full has-[>:first-child:nth-last-child(2)]:w-auto has-[>:first-child:nth-last-child(2)]:grid-cols-[minmax(0,756px)_minmax(0,316px)] has-[>:first-child:nth-last-child(2)]:px-0",
			className,
		)}
		{...props}
	/>
);

export const AppWidgetLayout = ({
	className,
	children,
	...props
}: ComponentProps<"div">) => (
	<div
		className={clsx(
			"w-full sticky top-14",
			"h-[calc(100svh-(--spacing(14)))]",
			className,
		)}
		{...props}
	>
		<SimpleBar className="h-full simplebar-hover">
			<div className="h-4"></div>
			{children}
		</SimpleBar>
	</div>
);

export const AppPageTitle = ({
	children,
	...props
}: React.ComponentProps<"h1">) => {
	return (
		<h1 className="text-3xl font-extrabold pt-6 pb-4" {...props}>
			{children}
		</h1>
	);
};
