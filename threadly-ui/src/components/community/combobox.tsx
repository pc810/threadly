"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCommunities } from "@/query/community";
import { CommunityItem } from "./avatar";

interface CommunityComboboxProps {
	id?: string;
	value?: string;
	onValueChange?: (communityId: string) => void;
}

export function CommunityCombobox({
	id,
	value,
	onValueChange,
}: CommunityComboboxProps) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

	const { data: rawCommunities, isLoading } = useCommunities();

	const communities = useMemo(
		() => rawCommunities?.filter((c) => c.name.startsWith(search)),
		[search, rawCommunities],
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					id={id}
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="justify-between"
				>
					{value ? (
						<CommunityItem size="sm" communityId={value} />
					) : (
						<span className="text-muted-foreground">Select community...</span>
					)}

					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-(--radix-popper-anchor-width) p-0">
				<Command shouldFilter={false}>
					<CommandInput
						placeholder="Search communities..."
						value={search}
						onValueChange={setSearch}
						className="h-9"
					/>

					<CommandList>
						{isLoading && (
							<div className="px-3 py-2 text-sm text-muted-foreground">
								Loading communities...
							</div>
						)}

						{!isLoading && <CommandEmpty>No community found.</CommandEmpty>}

						<CommandGroup>
							{communities?.map((community) => (
								<CommandItem
									key={community.id}
									value={community.id}
									onSelect={(v) => {
										onValueChange?.(v);
										setOpen(false);
										setSearch("");
									}}
								>
									<CommunityItem communityId={community.id} />
									<Check
										className={cn(
											"ml-auto",
											value === community.id ? "opacity-100" : "opacity-0",
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
