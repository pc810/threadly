import clsx from "clsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUserName, getTwoCharacter, getUserLink } from "@/lib/format";
import { useUser } from "@/query/user";
import { UserCard, UserItemCard } from "./card";

type UserAvatarSize = "sm" | "md";

type UserProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
	userId: string;
	hasName?: boolean;
	size?: UserAvatarSize;
};

export const AppUser = ({
	userId,
	hasName,
	size = "sm",
	className,
	...props
}: UserProps) => {
	const { data: user, isLoading } = useUser(userId);
	if (isLoading || user == null)
		return (
			<UserCard href={"#"} {...props}>
				<Skeleton
					className={clsx(size === "sm" ? "size-6" : "size-8", "rounded-full")}
				/>
				{hasName && <Skeleton className="h-4 w-8" />}
			</UserCard>
		);

	const userLink = getUserLink(user.name);

	return (
		<UserCard href={userLink} {...props}>
			<UserAvatar size={size} src={"#"} name={user.name} />
			{hasName && formatUserName(user.name)}
		</UserCard>
	);
};

type UserItemProps = React.HTMLAttributes<HTMLDivElement> & {
	userId: string;
	size?: UserAvatarSize;
};

export const UserItem = ({ userId, size, ...props }: UserItemProps) => {
	const { data: user, isLoading } = useUser(userId);
	if (isLoading || user == null)
		return (
			<UserItemCard {...props}>
				<Skeleton className="size-6" />
				<Skeleton className="h-4 w-8" />
			</UserItemCard>
		);

	return (
		<UserItemCard {...props}>
			<UserAvatar size={size} src={"#"} name={user.name} />
			{formatUserName(user.name)}
		</UserItemCard>
	);
};

type AppUserAvatarProps = React.HTMLAttributes<HTMLDivElement> & {
	userId: string;
	hasName?: boolean;
	size?: UserAvatarSize;
};

export const AppUserAvatar = ({
	userId,
	hasName,
	size = "sm",
	className,
	...props
}: AppUserAvatarProps) => {
	const { data: user, isLoading } = useUser(userId);
	if (isLoading || user == null)
		return (
			<UserItemCard className={clsx(className, "rounded-full")} {...props}>
				<Skeleton
					className={clsx(size === "sm" ? "size-6" : "size-8", "rounded-full")}
				/>
				{hasName && <Skeleton className="h-4 w-8" />}
			</UserItemCard>
		);

	return (
		<UserItemCard {...props}>
			<UserAvatar size={size} src={"#"} name={user.name} />
			{hasName && formatUserName(user.name)}
		</UserItemCard>
	);
};

export const UserAvatar = ({
	src,
	name,
	className,
	size = "md",
}: {
	src: string;
	name: string;
	className?: string;
	size?: UserAvatarSize;
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
