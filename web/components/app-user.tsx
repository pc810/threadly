import clsx from "clsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatUserName, getTwoCharacter, getUserLink } from "@/lib/format";
import Link, { LinkProps } from "next/link";
import { Skeleton } from "./ui/skeleton";
import { useUser } from "@/query/user.query";

type AppUserProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  userId: string;
};

export const AppUser = ({ userId, ...props }: AppUserProps) => {
  const { data: user, isLoading } = useUser(userId);
  if (isLoading || user == null)
    return (
      <AppUserCard href={"#"} {...props}>
        <Skeleton className="size-6" />
        <Skeleton className="h-4 w-8" />
      </AppUserCard>
    );

  const userLink = getUserLink(user.name);

  return (
    <AppUserCard href={userLink} {...props}>
      <AppUserAvatar src={"#"} name={user.name} />
      {formatUserName(user.name)}
    </AppUserCard>
  );
};

const AppUserCard = ({
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps) => {
  return (
    <Link
      className={clsx(
        "flex items-center text-xs max-w-max font-medium gap-1 hover:text-accent-foreground transition-colors",
        className
      )}
      {...props}
    />
  );
};

export const AppUserAvatar = ({
  src,
  name,
  className,
}: {
  src: string;
  name: string;
  className?: string;
}) => {
  return (
    <Avatar className={clsx("size-8 rounded-full text-foreground", className)}>
      <AvatarImage src={src} alt={name} />
      <AvatarFallback className="rounded-lg">
        {getTwoCharacter(name)}
      </AvatarFallback>
    </Avatar>
  );
};
