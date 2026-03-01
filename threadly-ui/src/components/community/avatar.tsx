import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
	formatCommunityName,
	formatUserName,
	getTwoCharacter,
} from "@/lib/format";
import { useCommunity } from "@/query/community";
import { Community } from "@/types/community";
import { UserDTO } from "@/types/user";
import { CommunityCard, CommunityItemCard } from "./card";

type CommunityAvatarSize = "sm" | "md";

type CommunityProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
	communityId: string;
};

export const AppCommunity = ({ communityId, ...props }: CommunityProps) => {
	const { data: community, isLoading } = useCommunity(communityId);

	if (isLoading || community == null)
		return <AppCommunityLoadingUI {...props} />;

	return <AppCommunityUI {...props} community={community} />;
};

type CommunityUIProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
	community: Community;
};
export const AppCommunityUI = ({ community, ...props }: CommunityUIProps) => {
	return (
		<CommunityCard
			to="/r/$communityName"
			params={{ communityName: community.name }}
			{...props}
		>
			<CommunityAvatar src={"#"} name={community.name} />
			{formatCommunityName(community.name)}
		</CommunityCard>
	);
};
type CommunityUserUIProps = React.HTMLAttributes<HTMLDivElement> & {
	community: Community;
	username: string;
};
export const AppCommunityUserUI = ({
	community,
	username,
	className,
	children,
	...props
}: CommunityUserUIProps) => {
	return (
		<div
			className={clsx(
				"flex items-center text-xs max-w-max font-medium gap-1",
				className,
			)}
			{...props}
		>
			<Link to="/r/$communityName" params={{ communityName: community.name }}>
				<CommunityAvatar src={"#"} name={community.name} />
			</Link>
			<div className="space-y-0.5 flex flex-col">
				<div className="flex gap-1">
					<Link
						className="hover:text-accent-foreground"
						to="/r/$communityName"
						params={{ communityName: community.name }}
					>
						{formatCommunityName(community.name)}
					</Link>
					{children}
				</div>
				<Link
					className="hover:text-accent-foreground"
					to="/user/$username"
					params={{ username: username }}
				>
					{username}
				</Link>
			</div>
			<Link
				className="absolute z-0 group"
				to="/r/$communityName"
				params={{ communityName: community.name }}
			>
				<div className="sr-only">{community.name}</div>
			</Link>
		</div>
	);
};

export const AppCommunityLoadingUI = (
	props: React.AnchorHTMLAttributes<HTMLAnchorElement>,
) => {
	return (
		<CommunityCard
			to="/r/$communityName"
			params={{ communityName: "#" }}
			{...props}
		>
			<Skeleton className="size-6" />
			<Skeleton className="h-4 w-8" />
		</CommunityCard>
	);
};

type CommunityItemProps = React.HTMLAttributes<HTMLDivElement> & {
	communityId: string;
	size?: CommunityAvatarSize;
};

export const CommunityItem = ({
	communityId,
	size = "md",
	...props
}: CommunityItemProps) => {
	const { data: community, isLoading } = useCommunity(communityId);
	if (isLoading || community == null)
		return (
			<CommunityItemCard {...props}>
				<Skeleton className="size-6" />
				<Skeleton className="h-4 w-8" />
			</CommunityItemCard>
		);

	return (
		<CommunityItemCard {...props}>
			<CommunityAvatar size={size} src={"#"} name={community.name} />
			{formatCommunityName(community.name)}
		</CommunityItemCard>
	);
};

export const CommunityAvatar = ({
	src,
	name,
	className,
	size,
}: {
	src: string;
	name: string;
	className?: string;
	size?: CommunityAvatarSize;
}) => {
	return (
		<Avatar
			className={clsx(
				"rounded-full text-foreground",
				size === "sm" ? "size-6" : "size-8",
				className,
			)}
		>
			<AvatarImage src={src} alt={name} />
			<AvatarFallback className="rounded-lg">
				{getTwoCharacter(name)}
			</AvatarFallback>
		</Avatar>
	);
};
