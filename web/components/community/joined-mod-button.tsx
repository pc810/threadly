"use client";

import { Community } from "@/types";
import { Button } from "@/components/ui/button";
import { usePermission } from "@/query/permission.query";
import { useFollowUnFollowCommunity } from "@/query/community.query";
import Link from "next/link";
import { getCommunityModLink } from "@/lib/format";

type CommunityButtonProps = {
  communityId: Community["id"];
  communityName: Community["name"];
};

export const JoinedModButton = (props: CommunityButtonProps) => {
  const { isLoading, CAN_FOLLOW, CAN_UNFOLLOW, MOD_PRIVILEGE } = usePermission(
    "COMMUNITY",
    props.communityId,
    ["CAN_FOLLOW", "CAN_UNFOLLOW", "MOD_PRIVILEGE"],
    "consistency"
  );

  if (isLoading)
    return (
      <Button variant="outline" className="rounded-full" size="lg">
        Loading
      </Button>
    );

  if (CAN_FOLLOW) return <FollowButton {...props} />;

  if (CAN_UNFOLLOW) return <UnFollowButton {...props} />;

  if (MOD_PRIVILEGE)
    return (
      <Button variant="default" className="rounded-full" size="lg" asChild>
        <Link href={getCommunityModLink(props.communityName) + "/moderators"}>
          Mod Tools
        </Link>
      </Button>
    );

  return null;
};

const FollowButton = (props: CommunityButtonProps) => {
  const { mutate: followCommunity, isPending } = useFollowUnFollowCommunity(
    props.communityId,
    "follow"
  );
  return (
    <Button
      variant="outline"
      className="rounded-full"
      size="lg"
      disabled={isPending}
      onClick={() => followCommunity()}
    >
      Join
    </Button>
  );
};

const UnFollowButton = (props: CommunityButtonProps) => {
  const { mutate: unFollowCommunity, isPending } = useFollowUnFollowCommunity(
    props.communityId,
    "unfollow"
  );
  return (
    <Button
      variant="outline"
      className="rounded-full"
      size="lg"
      disabled={isPending}
      onClick={() => unFollowCommunity()}
    >
      UnFollow
    </Button>
  );
};
