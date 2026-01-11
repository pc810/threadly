import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import React from "react";
import { CommunityAvatar } from "@/components/community/avatar";
import { Button } from "@/components/ui/button";
import type { Community } from "@/types/community";
import {
	Accordion,
	AccordionContent,
	AccordionGhostTrigger,
	AccordionItem,
} from "./ui/accordion";

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

export function NavList({ items }: { items: NavItem[] }) {
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

export function NavCollapsibleList({
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

export const NavbarButton = ({
	title,
	url,
	icon,
	community,
}: NavButtonProps) => {
	const Icon = icon ?? React.Fragment;

	const ImageIcon =
		community != null ? (
			<CommunityAvatar src={"/"} className="size-8" name={community.name} />
		) : null;
	return (
		<Button
			asChild
			key={title}
			variant="ghost"
			className="justify-start w-full"
		>
			<Link to={url}>
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
