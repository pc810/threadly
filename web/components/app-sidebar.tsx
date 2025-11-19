"use client";

import SimpleBar from "simplebar-react";
import * as React from "react";
import {
  Accessibility,
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
} from "lucide-react";

import { NavMain, NavMainList } from "@/components/nav-main";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { useCommunities } from "@/query/community.query";
import { formatCommunityName, getCommunityLink } from "@/lib/format";

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
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
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
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
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
