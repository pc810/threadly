"use client";

import { JoinedModButton } from "@/components/community";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getCommunityPostCreateLink, getTwoCharacter } from "@/lib/format";
import { useCommunityByName } from "@/query/community.query";
import { BellOff, Ellipsis, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Default() {
  const pathname = usePathname();

  const communityName = pathname.split("/")[2];

  const { data: community, isLoading } = useCommunityByName(communityName);

  if (isLoading || community == null) return null;

  return (
    <div className="w-full md:w-[1120px] mx-auto mb-4">
      <div className="h-18 bg-card rounded-md my-2"></div>
      <div className="px-4 -mt-10 flex items-center gap-2">
        <Avatar className="size-22 border-4 border-background rounded-full">
          <AvatarImage src={"/"} alt={community.name} />
          <AvatarFallback className="rounded-lg">
            {getTwoCharacter(community.name)}
          </AvatarFallback>
        </Avatar>
        <div className="text-3xl font-bold self-end">r/{community.name}</div>

        <div className="ml-auto flex items-end gap-2 self-end">
          <Button variant="outline" className="rounded-full" size="lg" asChild>
            <Link href={getCommunityPostCreateLink(community.name)}>
              <Plus />
              Create Post
            </Link>
          </Button>
          <Button variant="outline" className="rounded-full" size="icon-lg">
            <BellOff />
          </Button>
          <JoinedModButton
            communityId={community.id}
            communityName={community.name}
          />
          <Button variant="outline" className="rounded-full" size="icon-lg">
            <Ellipsis />
          </Button>
        </div>
      </div>
    </div>
  );
}
