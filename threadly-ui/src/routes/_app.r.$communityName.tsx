import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/header";
import { SidebarInset } from "@/components/ui/sidebar";
import { getCommunityByName } from "@/query/community";
import { queryKeys } from "@/query/keys";

export const Route = createFileRoute("/_app/r/$communityName")({
	component: RouteComponent,

	loader: async ({ params, context }) => {
		const community = await getCommunityByName(params.communityName);

		if (!community) {
			throw notFound();
		}

		context.queryClient.setQueryData(
			queryKeys.community.detail(community.id),
			community,
		);

		return community;
	},
});

function RouteComponent() {
	return (
		<>
			<SiteHeader />
			<div className="flex flex-1">
				<AppSidebar />
				<SidebarInset className="flex-1 min-h-0  pt-14">
					<Outlet />
				</SidebarInset>
			</div>
		</>
	);
}
