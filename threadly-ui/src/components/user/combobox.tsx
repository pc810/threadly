"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
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
import { UserItem } from "@/components/user/avatar";
import { cn } from "@/lib/utils";
import { useUsers } from "@/query/user";

type User = {
	id: string;
	name: string;
};

interface UserComboboxOptions {
	excludeSelf?: boolean;
}

interface UserComboboxProps {
	value?: string | null;
	onChange?: (user: string | null) => void;
	options?: UserComboboxOptions;
}

export function UserCombobox({ value, onChange, options }: UserComboboxProps) {
	const [open, setOpen] = React.useState(false);
	const [search, setSearch] = React.useState("");

	const { data: users, isLoading } = useUsers(search, {
		enabled: open,
		...options,
	});

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="justify-between w-full"
				>
					{value ? (
						<UserItem size="sm" userId={value} />
					) : (
						<span className="text-muted-foreground">Select user...</span>
					)}

					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-(--radix-popper-anchor-width) p-0">
				<Command shouldFilter={false}>
					<CommandInput
						placeholder="Search users..."
						value={search}
						onValueChange={setSearch}
						className="h-9"
					/>

					<CommandList>
						{isLoading && (
							<div className="px-3 py-2 text-sm text-muted-foreground">
								Loading users...
							</div>
						)}

						{!isLoading && <CommandEmpty>No users found.</CommandEmpty>}

						<CommandGroup>
							{users?.content.map((user) => (
								<CommandItem
									key={user.id}
									value={user.id}
									onSelect={(v) => {
										const selected =
											users?.content.find((u) => u.id === v) ?? null;

										onChange?.(selected?.id ?? null);
										setOpen(false);
										setSearch("");
									}}
								>
									<UserItem userId={user.id} />
									<Check
										className={cn(
											"ml-auto",
											value === user.id ? "opacity-100" : "opacity-0",
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
