import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, AppWidgetLayout } from "@/components/app-layout";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/header";
import { PostFeed } from "@/components/post/feed";
import { SidebarInset } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_app/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<SiteHeader />
			<div className="flex flex-1">
				<AppSidebar />
				<SidebarInset className="flex-1 min-h-0  pt-14">
					<AppLayout>
						<PostFeed />
						<AppWidgetLayout>Home widget</AppWidgetLayout>
					</AppLayout>
				</SidebarInset>
			</div>
		</>
	);
}
