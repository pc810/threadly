"use client";

import { ChevronDown, type LucideIcon } from "lucide-react";
import * as React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionGhostTrigger,
} from "@/components/ui/accordion";
import { Button } from "./ui/button";
import Link from "next/link";
import clsx from "clsx";
import { AppCommunity, AppCommunityAvatar } from "./app-community";
import { Community } from "@/types";

type NavButtonProps = {
  title: string;
  url: string;
  icon?: LucideIcon;
  community?: Community;
};

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: NavButtonProps[];
};

export function NavMain({
  items,
  className,
}: {
  items: NavItem[];
  className?: string;
}) {
  return (
    <Accordion
      type="multiple"
      className={clsx("w-full", className)}
      defaultValue={items.filter((i) => i.isActive).map((i) => i.title)}
    >
      {items.map((item) => (
        <AccordionItem value={item.title} key={item.title} className="py-3">
          <AccordionGhostTrigger className="font-light text-xs tracking-widest uppercase">
            {item.title}
          </AccordionGhostTrigger>
          <AccordionContent className="flex flex-col text-balance p-1">
            {item.items?.map((subItem) => (
              <NavbarButton key={subItem.title} {...subItem} />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function NavMainList({ items }: { items: NavItem[] }) {
  return (
    <div className="w-full border-b first:border-t py-3 last:border-b-0">
      {items.map((item) => (
        <div key={item.title}>
          <NavbarButton {...item} />
        </div>
      ))}
    </div>
  );
}

export const NavbarButton = ({
  title,
  url,
  icon,
  community,
}: NavButtonProps) => {
  const Icon = icon ?? React.Fragment;

  const ImageIcon =
    community != null ? (
      <AppCommunityAvatar src={"/"} name={community.name} />
    ) : null;
  return (
    <Button
      asChild
      key={title}
      variant="ghost"
      className="justify-start w-full"
    >
      <Link href={url}>
        {ImageIcon ?? (
          <div className="size-8 grid place-content-center">
            <Icon className="size-5" />
          </div>
        )}

        {title}
      </Link>
    </Button>
  );
};
