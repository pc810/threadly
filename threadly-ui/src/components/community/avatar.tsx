import clsx from "clsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCommunityName, getTwoCharacter } from "@/lib/format";
import { useCommunity } from "@/query/community";
import { CommunityCard, CommunityItemCard } from "./card";

type CommunityAvatarSize = "sm" | "md";

type CommunityProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
	communityId: string;
};

export const AppCommunity = ({ communityId, ...props }: CommunityProps) => {
	const { data: community, isLoading } = useCommunity(communityId);

	if (isLoading || community == null)
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
