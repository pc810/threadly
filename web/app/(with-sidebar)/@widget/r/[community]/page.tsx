"use client";

import {
  ClientCommunityWidgetWrapper,
  CommunityEdit,
  CommunityStatsList,
} from "@/components/community";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommunityByName } from "@/query/community.query";
import { usePermission } from "@/query/permission.query";
import { useParams } from "next/navigation";

export default function CommunityWidget() {
  const { community: communityName } = useParams();

  const { data: community } = useCommunityByName(
    communityName?.toString() ?? ""
  );

  const { UPDATE: canUpdateCommunity, isLoading } = usePermission(
    "COMMUNITY",
    community?.id,
    ["UPDATE"],
    "latency"
  );

  if (!community) return <Skeleton className="w-full h-5" />;

  return (
    <ClientCommunityWidgetWrapper>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{community.title}</CardTitle>
            {!isLoading && canUpdateCommunity && (
              <CommunityEdit community={community} />
            )}
          </div>
          <CardDescription>{community.description}</CardDescription>
        </CardHeader>

        <CardContent>
          <CommunityStatsList community={community} />
        </CardContent>
      </Card>
    </ClientCommunityWidgetWrapper>
  );
}
