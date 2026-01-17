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

type NavLinkItem = {
	navType: "url";
	url: string;
};
type NavButtonItem = {
	navType: "button";
	onClick?: () => void;
};
type NavButtonCollapsibeTriggerItem = {
	navType: "root";
	isActive: boolean;
	items?: NavButtonProps[];
};
type NavLinkButtonItem =
	| NavLinkItem
	| NavButtonItem
	| NavButtonCollapsibeTriggerItem;

export type NavButtonProps = NavLinkButtonItem & {
	title: string;
	icon?: LucideIcon;
	community?: Community;
};

export type NavItem = NavLinkButtonItem & {
	title: string;
	icon: LucideIcon;
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
			defaultValue={items.map((i) => i.title)}
		>
			{items.map((item) => (
				<AccordionItem value={item.title} key={item.title} className="py-3">
					<AccordionGhostTrigger className="font-light text-xs tracking-widest uppercase">
						{item.title}
					</AccordionGhostTrigger>
					<AccordionContent className="flex flex-col text-balance p-1">
						{item.navType === "root" &&
							item.items?.map((subItem) => (
								<NavbarButton key={subItem.title} {...subItem} />
							))}
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
}

export const NavbarButton = (props: NavButtonProps) => {
	const { title, icon, community, navType } = props;

	const Icon = icon ?? React.Fragment;

	const ImageIcon =
		community != null ? (
			<CommunityAvatar src={"/"} className="size-8" name={community.name} />
		) : null;

	const children = (
		<>
			{ImageIcon ?? (
				<div className="size-8 grid place-content-center">
					<Icon className="size-5" />
				</div>
			)}

			{title}
		</>
	);

	if (navType === "url") {
		return (
			<Button
				asChild
				key={title}
				variant="ghost"
				className="justify-start w-full font-normal"
			>
				<Link to={props.url}>{children}</Link>
			</Button>
		);
	}
	if (navType === "button")
		return (
			<Button
				key={title}
				variant="ghost"
				className="justify-start w-full font-normal"
				onClick={props.onClick}
			>
				{children}
			</Button>
		);

	return null;
};
