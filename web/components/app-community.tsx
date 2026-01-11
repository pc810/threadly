import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  formatCommunityName,
  getCommunityLink,
  getTwoCharacter,
} from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommunity } from "@/query/community.query";
import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import React from "react";

type AppCommunityProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  communityId: string;
};

export const AppCommunity = ({ communityId, ...props }: AppCommunityProps) => {
  const { data: community, isLoading } = useCommunity(communityId);

  if (isLoading || community == null)
    return (
      <AppCommunityCard href={"#"} {...props}>
        <Skeleton className="size-6" />
        <Skeleton className="h-4 w-8" />
      </AppCommunityCard>
    );

  const communityLink = getCommunityLink(community.name);

  return (
    <AppCommunityCard href={communityLink} {...props}>
      <AppCommunityAvatar src={"#"} name={community.name} />
      {formatCommunityName(community.name)}
    </AppCommunityCard>
  );
};

const AppCommunityCard = ({
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

export const AppCommunityAvatar = ({
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
