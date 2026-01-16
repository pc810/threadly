import { Link } from "@tanstack/react-router";
import {
	CircleDollarSignIcon,
	LogOut,
	MenuSquare,
	MousePointerClickIcon,
	PieChart,
	Settings,
	Shield,
	Shirt,
	Trophy,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSwitchItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { AppUserAvatar, UserAvatar } from "@/components/user/avatar";
import { formatUserName } from "@/lib/format";
import { useAuth } from "@/query/auth";
import { useUser } from "@/query/user";

export const UserMenu = () => {
	const { auth, isLoading, signOut } = useAuth();

	if (isLoading) return <Skeleton className="size-10 rounded-full" />;

	if (!auth) return null;

	return <UserMenuProfile userId={auth.id} onSignOut={() => signOut()} />;
};

const UserMenuProfile = ({
	userId,
	onSignOut,
}: {
	userId: string;
	onSignOut?: () => void;
}) => {
	const { data: user, isLoading } = useUser(userId);

	const { setTheme, systemTheme, theme } = useTheme();

	if (!user || isLoading) return null;

	const darkMode =
		theme === "system" ? systemTheme === "dark" : theme === "dark";

	const setDarkMode = () => setTheme(darkMode ? "light" : "dark");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="rounded-full outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
				>
					<AppUserAvatar userId={userId} size="md" />
					<div className="sr-only">User Menu</div>
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-56" align="start">
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link
							to={"/user/$username"}
							params={{ username: user.name }}
							className="flex items-center gap-2"
						>
							<UserAvatar size="md" src={"#"} name={user.name} />
							<div className="flex flex-1 flex-col">
								<span className="text-popover-foreground text-sm">
									View Profile
								</span>
								<span className="text-muted-foreground text-xs">
									{formatUserName(user.name)}
								</span>
							</div>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />

					<DropdownMenuItem asChild>
						<Link to="/">
							<Shirt />
							Edit Avatar
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link to="/">
							<MenuSquare />
							Drafts
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link to="/">
							<Trophy />
							<UserMenuItem title="Achievements" description="7 unlocked" />
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link to="/">
							<CircleDollarSignIcon />
							<UserMenuItem
								title="Earn"
								description="Earn points on Threadly"
							/>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link to="/">
							<Shield />
							Premium
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link to="/">
							<Settings />
							Settings
						</Link>
					</DropdownMenuItem>
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
					<DropdownMenuItem asChild>
						<Link to="/">
							<MousePointerClickIcon />
							Advertise on Threadly
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link to="/">
							<PieChart />
							Try Threadly Pro
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuItem onSelect={onSignOut} variant="destructive">
					<LogOut />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const UserMenuItem = ({
	title,
	description,
}: {
	title: string;
	description: string;
}) => (
	<div className="flex flex-1 flex-col">
		<span className="text-popover-foreground text-sm">{title}</span>
		<span className="text-muted-foreground text-xs">{description}</span>
	</div>
);
