"use client";

import {
  ClientCommunityWidgetWrapper,
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
import { useParams } from "next/navigation";

export default function CommunityWidget() {
  const { community: communityName } = useParams();

  const { data: community } = useCommunityByName(
    communityName?.toString() ?? ""
  );

  if (!community) return <Skeleton className="w-full h-5" />;

  return (
    <ClientCommunityWidgetWrapper>
      <Card>
        <CardHeader>
          <CardTitle>{community.title}</CardTitle>
          <CardDescription>{community.description}</CardDescription>
        </CardHeader>

        <CardContent>
          <CommunityStatsList community={community} />
        </CardContent>
      </Card>
    </ClientCommunityWidgetWrapper>
  );
}
