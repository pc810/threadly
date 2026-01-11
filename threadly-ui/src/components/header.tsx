import { Link } from "@tanstack/react-router";
import { Command, SidebarIcon } from "lucide-react";
import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";

export function SiteHeader() {
	const { toggleSidebar } = useSidebar();

	return (
		<header className="bg-background fixed top-0 z-50 flex w-full items-center border-b">
			<div className="flex h-(--header-height) w-full items-center gap-2 px-4">
				<Button
					className="h-8 w-8"
					variant="ghost"
					size="icon"
					onClick={toggleSidebar}
				>
					<SidebarIcon />
				</Button>
				<Separator orientation="vertical" className="mr-2 h-4" />
				<Link to="/" className="flex gap-2">
					<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
						<Command className="size-4" />
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight items-center">
						<span className="truncate font-medium">Threadly</span>
					</div>
				</Link>
				<SearchForm className="w-full sm:mx-auto sm:w-auto" />
			</div>
		</header>
	);
}
