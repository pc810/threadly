import { Link } from "@tanstack/react-router";

import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuSwitchItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { AppUserAvatar, UserAvatar } from "@/components/user/avatar";
import { formatUserName, getUserLink } from "@/lib/format";
import { useAuth } from "@/query/auth";
import { useUser } from "@/query/user";

export const UserMenu = () => {
	const { auth, isLoading } = useAuth();

	if (isLoading) return <Skeleton className="size-10 rounded-full" />;

	if (!auth) return null;

	return <UserMenuProfile userId={auth.id} />;
};

const UserMenuProfile = ({ userId }: { userId: string }) => {
	const [darkMode, setDarkMode] = useState(false);
	const { data: user, isLoading } = useUser(userId);

	if (!user || isLoading) return null;

	const userLink = getUserLink(user.name);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<AppUserAvatar userId={userId} size="md" />
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-56" align="start">
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link to={userLink} className="flex gap-2">
							<UserAvatar size="md" src={"#"} name={user.name} />
							<div className="space-y-1 flex flex-col">
								<span>View Profile</span>
								<span>{formatUserName(user.name)}</span>
							</div>
						</Link>
					</DropdownMenuItem>

					<DropdownMenuItem>Billing</DropdownMenuItem>

					<DropdownMenuItem>Settings</DropdownMenuItem>

					<DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuSwitchItem
					checked={darkMode}
					onCheckedChange={setDarkMode}
					className="flex items-center justify-between"
				>
					<span>Dark mode</span>
				</DropdownMenuSwitchItem>
				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem>Team</DropdownMenuItem>

					<DropdownMenuSub>
						<DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuItem>Email</DropdownMenuItem>
								<DropdownMenuItem>Message</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>More...</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>

					<DropdownMenuItem>New Team</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuItem>GitHub</DropdownMenuItem>
				<DropdownMenuItem>Support</DropdownMenuItem>
				<DropdownMenuItem disabled>API</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
