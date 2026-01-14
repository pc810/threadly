import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import {
	ArrowLeft,
	Mail,
	ShieldIcon,
	SquareTerminal,
	Users,
} from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { routeData } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/header";
import {
	NavbarButton,
	NavCollapsibleList,
	type NavItem,
	NavList,
} from "@/components/nav-list";
import { Sidebar, SidebarContent, SidebarInset } from "@/components/ui/sidebar";
import { getCommunityLink, getCommunityModLink } from "@/lib/format";
import { getCommunityByName } from "@/query/community";
import { queryKeys } from "@/query/keys";

export const Route = createFileRoute("/_app/mod/$communityName")({
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
				<AppModSidebar />
				<SidebarInset className="flex-1 min-h-0 pt-14">
					<AppLayout>
						<Outlet />
					</AppLayout>
				</SidebarInset>
			</div>
		</>
	);
}

function AppModSidebar() {
	const { communityName } = Route.useParams();

	const moderationNav: NavItem = {
		title: "Overview",
		navType: "root",
		icon: SquareTerminal,
		isActive: true,
		items: [
			{
				title: "Mods & Members",
				url: getCommunityModLink(communityName) + "/moderators",
				navType: "url",
				icon: Users,
			},
			{
				title: "Mod Queue",
				url: "#",
				navType: "url",
				icon: ShieldIcon,
			},
			{
				title: "Mod Mail",
				url: "#",
				navType: "url",
				icon: Mail,
			},
		],
	};

	return (
		<Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
			<SidebarContent>
				<div style={{ maxHeight: "100%" }} className="px-4">
					<div className="pt-4">
						<NavbarButton
							navType="url"
							icon={ArrowLeft}
							title="Exit Mod tools"
							url={getCommunityLink(communityName)}
						/>
					</div>

					<NavCollapsibleList items={[moderationNav]} />
					<div>
						<NavList items={routeData.navSecondary} />
						<NavList items={routeData.rules} />
					</div>
				</div>
			</SidebarContent>
		</Sidebar>
	);
}
