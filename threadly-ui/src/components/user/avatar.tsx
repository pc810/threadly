import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUserName, getTwoCharacter } from "@/lib/format";
import { useUser } from "@/query/user";
import { UserCard, UserItemCard } from "./card";

export const userAvatarVariants = cva("rounded-full", {
	variants: {
		size: {
			sm: "size-6",
			md: "size-8",
			lg: "size-12",
			xl: "size-16",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

type UserAvatarSize = VariantProps<typeof userAvatarVariants>["size"];

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
				<Skeleton className={userAvatarVariants({ size })} />
				{hasName && <Skeleton className="h-4 w-8" />}
			</UserCard>
		);

	return (
		<UserCard
			to={"/user/$username"}
			params={{ username: user.name }}
			{...props}
		>
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
				<Skeleton className={userAvatarVariants({ size })} />
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
				<Skeleton className={userAvatarVariants({ size })} />
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
				userAvatarVariants({ size }),
				"text-foreground",
				className,
			)}
		>
			<AvatarImage src={src} alt={name} />
			<AvatarFallback
				className={clsx(
					"rounded-lg",
					(size === "xl" || size === "lg") && "text-2xl",
				)}
			>
				{getTwoCharacter(name)}
			</AvatarFallback>
		</Avatar>
	);
};
