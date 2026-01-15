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
import { useModal } from "@/hooks/modal";
import { formatCommunityName, getCommunityLink } from "@/lib/format";
import { useCommunities } from "@/query/community";
import {
	type NavButtonProps,
	NavCollapsibleList,
	type NavItem,
	NavList,
} from "../nav-list";

export function AppSidebar() {
	const { data: communities } = useCommunities();

	const { openModal } = useModal();

	const moderationNav: NavItem = {
		title: "Moderation",
		icon: SquareTerminal,
		isActive: true,
		navType: "root",
		items: [
			{
				title: "Mod Queue",
				url: "#",
				icon: ShieldIcon,
				navType: "url",
			},
			{
				title: "Mod Mail",
				url: "#",
				icon: Mail,
				navType: "url",
			},
			...(communities ?? []).map(
				(c) =>
					({
						title: formatCommunityName(c.name),
						url: getCommunityLink(c.name),
						community: c,
						navType: "url",
					}) satisfies NavButtonProps,
			),
		],
	};

	const createCommunity: NavItem = {
		title: "Start a community",
		icon: Plus,
		navType: "button",
		onClick: () => openModal("CommunityAdd"),
	};

	return (
		<Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
			<SidebarContent>
				<div style={{ maxHeight: "100%" }} className="px-4">
					<NavList items={[...routeData.primary, createCommunity]} />
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

export const routeData: Record<string, NavItem[]> = {
	primary: [
		{
			title: "Home",
			url: "/",
			navType: "url",
			icon: Home,
		},
		{
			title: "Popular",
			url: "#",
			navType: "url",
			icon: TrendingUp,
		},
		{
			title: "Explore",
			url: "#",
			navType: "url",
			icon: Globe,
		},
	],
	navMain: [
		{
			title: "Custom Feeds",
			navType: "root",
			isActive: false,
			icon: Bot,
			items: [
				{
					title: "Genesis",
					url: "#",
					navType: "url",
					icon: Globe,
				},
				{
					title: "Explorer",
					url: "#",
					navType: "url",
					icon: Globe,
				},
				{
					title: "Quantum",
					url: "#",
					navType: "url",
					icon: Globe,
				},
			],
		},
		{
			title: "Recent",
			navType: "root",
			isActive: false,
			icon: BookOpen,
			items: [
				{
					title: "Introduction",
					url: "#",
					navType: "url",
					icon: Globe,
				},
				{
					title: "Get Started",
					url: "#",
					navType: "url",
					icon: Globe,
				},
				{
					title: "Tutorials",
					url: "#",
					navType: "url",
					icon: Globe,
				},
				{
					title: "Changelog",
					url: "#",
					navType: "url",
					icon: Globe,
				},
			],
		},
	],
	navSecondary: [
		{
			title: "Communities",
			url: "#",
			navType: "url",
			icon: LifeBuoy,
		},
		{
			title: "Best of Reddit",
			url: "#",
			navType: "url",
			icon: Send,
		},
	],
	rules: [
		{
			title: "Reddit Rules",
			url: "#",
			navType: "url",
			icon: BookOpen,
		},
		{
			title: "Privacy Policy",
			url: "#",
			navType: "url",
			icon: BookOpen,
		},
		{
			title: "User Agreement",
			url: "#",
			navType: "url",
			icon: BookOpen,
		},
		{
			title: "Accessibility",
			url: "#",
			navType: "url",
			icon: PersonStanding,
		},
	],
};
