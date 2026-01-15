import clsx from "clsx";
import { Command } from "lucide-react";

interface AppLogoProps extends React.ComponentProps<"div"> {
	isFull?: boolean;
}

export const AppLogo = ({ className, isFull, ...props }: AppLogoProps) => {
	return (
		<div className={clsx("flex gap-2", className)} {...props}>
			<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
				<Command className="size-4" />
			</div>
			{isFull && (
				<div className="grid flex-1 text-left text-sm leading-tight items-center">
					<span className="truncate font-medium">Threadly</span>
				</div>
			)}
		</div>
	);
};
