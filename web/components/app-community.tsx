import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCommunity } from "@/query/community.query";
import { Skeleton } from "./ui/skeleton";
import React from "react";
import clsx from "clsx";
import { getTwoCharacter } from "@/lib/format";

type AppCommunityProps = React.ComponentProps<"div"> & {
  communityId: string;
};

export const AppCommunity = ({ communityId, ...props }: AppCommunityProps) => {
  const { data: community, isLoading } = useCommunity(communityId);

  if (isLoading || community == null)
    return (
      <AppCommunityCard {...props}>
        <Skeleton className="size-6" />
        <Skeleton className="h-4 w-8" />
      </AppCommunityCard>
    );

  return (
    <AppCommunityCard {...props}>
      <Avatar className="h-8 w-8 rounded-full">
        <AvatarImage src={"/"} alt={community.name} />
        <AvatarFallback className="rounded-lg">
          {getTwoCharacter(community.name)}
        </AvatarFallback>
      </Avatar>
      r/{community.name}
    </AppCommunityCard>
  );
};

const AppCommunityCard = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={clsx(
        "flex items-center text-xs max-w-max font-medium gap-1",
        className
      )}
      {...props}
    />
  );
};
