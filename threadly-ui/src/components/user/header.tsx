import { Link, type LinkProps, useLoaderData } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { isSelfProfileAtom } from "@/atoms/profile";
import { buttonVariants } from "@/components/ui/button";
import { SelectSeparator } from "@/components/ui/select";
import { formatUserName } from "@/lib/format";
import { cn } from "@/lib/utils";
import { AppUserAvatar } from "./avatar";

export const UserProfileHeader = () => {
	const userDto = useLoaderData({ from: "/_app/user/$username" });

	const isSelfProfile = useAtomValue(isSelfProfileAtom);

	return (
		<>
			<div className="py-4">
				<div className="flex items-center gap-2 mb-5">
					<AppUserAvatar userId={userDto.id} size="xl" />

					<div className="flex flex-col gap-0.5">
						<div className="text-2xl font-bold">{userDto.name}</div>
						<div className="text-sm font-medium">
							{formatUserName(userDto.name)}
						</div>
					</div>
				</div>

				<div className="bg-transparent flex flex-wrap gap-1">
					<TabsPrimaryLink
						to="/user/$username"
						params={{ username: userDto.name }}
					>
						Overview
					</TabsPrimaryLink>
					<TabsPrimaryLink
						to="/user/$username/submitted"
						params={{ username: userDto.name }}
					>
						Posts
					</TabsPrimaryLink>
					<TabsPrimaryLink
						to="/user/$username/comments"
						params={{ username: userDto.name }}
					>
						Comments
					</TabsPrimaryLink>
					{isSelfProfile && (
						<>
							<TabsPrimaryLink
								to="/user/$username/saved"
								params={{ username: userDto.name }}
							>
								Saved
							</TabsPrimaryLink>
							<TabsPrimaryLink
								to="/user/$username/upvoted"
								params={{ username: userDto.name }}
							>
								Upvoted
							</TabsPrimaryLink>
							<TabsPrimaryLink
								to="/user/$username/downvoted"
								params={{ username: userDto.name }}
							>
								Downvoted
							</TabsPrimaryLink>
						</>
					)}
				</div>
			</div>
			<SelectSeparator className="mb-4" />
		</>
	);
};

type TabsPrimaryLinkProps = {
	children: React.ReactNode;
} & Pick<LinkProps, "to" | "params" | "search">;

function TabsPrimaryLink({ to, children }: TabsPrimaryLinkProps) {
	return (
		<Link
			activeOptions={{ exact: true }}
			to={to}
			className={cn(buttonVariants({ variant: "ghost" }))}
			activeProps={{
				className: cn(
					buttonVariants({
						variant: "default",
						className: "!bg-primary",
					}),
				),
			}}
			inactiveProps={{
				className: cn(buttonVariants({ variant: "ghost" })),
			}}
		>
			{children}
		</Link>
	);
}
