"use client";

import SimpleBar from "simplebar-react";
import * as React from "react";
import {
  Accessibility,
  ArrowLeft,
  Book,
  BookOpen,
  Bot,
  Frame,
  Globe,
  Home,
  LifeBuoy,
  Mail,
  Map,
  PersonStanding,
  PieChart,
  Plus,
  Send,
  ShieldIcon,
  SquareTerminal,
  TrendingUp,
  Users,
} from "lucide-react";

import { NavbarButton, NavMain, NavMainList } from "@/components/nav-main";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { useCommunities } from "@/query/community.query";
import {
  formatCommunityName,
  getCommunityLink,
  getCommunityModLink,
} from "@/lib/format";
import { useParams } from "next/navigation";

const data = {
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

export function AppModSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: communities } = useCommunities();
  const { community: communityParam } = useParams();
  const communityName = `${communityParam}`;
  const moderationNav = {
    title: "Overview",
    url: "#",
    icon: SquareTerminal,
    isActive: true,
    items: [
      {
        title: "Mods & Members",
        url: getCommunityModLink(communityName) + "/moderators",
        icon: Users,
      },
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
    ],
  };

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent>
        <SimpleBar style={{ maxHeight: "100%" }} className="px-4">
          <div className="pt-4">
            <NavbarButton
              icon={ArrowLeft}
              title="Exit Mod tools"
              url={getCommunityLink(communityName)}
            />
          </div>

          <NavMain items={[moderationNav]} />
          <div>
            <NavMainList items={data.navSecondary} />
            <NavMainList items={data.rules} />
          </div>
        </SimpleBar>
      </SidebarContent>
    </Sidebar>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent>
        <SimpleBar style={{ maxHeight: "100%" }} className="px-4">
          <NavMainList items={data.primary} />
          <NavMain items={[moderationNav, ...data.navMain]} />
          <div>
            <NavMainList items={data.navSecondary} />
            <NavMainList items={data.rules} />
          </div>
        </SimpleBar>
      </SidebarContent>
    </Sidebar>
  );
}
