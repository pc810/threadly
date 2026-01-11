import {
	BookOpen,
	Bot,
	Globe,
	Home,
	LifeBuoy,
	Mail,
	PersonStanding,
	Plus,
	Send,
	ShieldIcon,
	SquareTerminal,
	TrendingUp,
} from "lucide-react";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { formatCommunityName, getCommunityLink } from "@/lib/format";
import { useCommunities } from "@/query/community";
import { NavCollapsibleList, NavList } from "./nav-list";

export function AppSidebar() {
	const { data: communities } = useCommunities();

	const moderationNav = {
		title: "Moderation",
		url: "#",
		icon: SquareTerminal,
		isActive: true,
		items: [
			{
				title: "Mod Queue",
				url: "#",
				icon: ShieldIcon,
			},
			{
				title: "Mod Mail",
				url: "#",
				icon: Mail,
			},
			...(communities ?? []).map((c) => ({
				title: formatCommunityName(c.name),
				url: getCommunityLink(c.name),
				community: c,
			})),
		],
	};

	return (
		<Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
			<SidebarContent>
				<div style={{ maxHeight: "100%" }} className="px-4">
					<NavList items={routeData.primary} />
					<NavCollapsibleList items={[moderationNav, ...routeData.navMain]} />
					<div>
						<NavList items={routeData.navSecondary} />
						<NavList items={routeData.rules} />
					</div>
				</div>
			</SidebarContent>
		</Sidebar>
	);
}

export const routeData = {
	primary: [
		{
			title: "Home",
			url: "#",
			icon: Home,
		},
		{
			title: "Popular",
			url: "#",
			icon: TrendingUp,
		},
		{
			title: "Explore",
			url: "#",
			icon: Globe,
		},
		{
			title: "Start a community",
			url: "/submit/community",
			icon: Plus,
		},
	],
	navMain: [
		{
			title: "Custom Feeds",
			url: "#",
			icon: Bot,
			items: [
				{
					title: "Genesis",
					url: "#",
					icon: Globe,
				},
				{
					title: "Explorer",
					url: "#",
					icon: Globe,
				},
				{
					title: "Quantum",
					url: "#",
					icon: Globe,
				},
			],
		},
		{
			title: "Recent",
			url: "#",
			icon: BookOpen,
			items: [
				{
					title: "Introduction",
					url: "#",
					icon: Globe,
				},
				{
					title: "Get Started",
					url: "#",
					icon: Globe,
				},
				{
					title: "Tutorials",
					url: "#",
					icon: Globe,
				},
				{
					title: "Changelog",
					url: "#",
					icon: Globe,
				},
			],
		},
	],
	navSecondary: [
		{
			title: "Communities",
			url: "#",
			icon: LifeBuoy,
		},
		{
			title: "Best of Reddit",
			url: "#",
			icon: Send,
		},
	],
	rules: [
		{
			title: "Reddit Rules",
			url: "#",
			icon: BookOpen,
		},
		{
			title: "Privacy Policy",
			url: "#",
			icon: BookOpen,
		},
		{
			title: "User Agreement",
			url: "#",
			icon: BookOpen,
		},
		{
			title: "Accessibility",
			url: "#",
			icon: PersonStanding,
		},
	],
};
