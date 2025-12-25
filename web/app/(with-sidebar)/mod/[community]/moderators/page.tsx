"use client";

import { useParams } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { AppPageTitle } from "@/components/app-page-title";
import { CommunityMembersTable } from "@/components/community";

import { useCommunityByName } from "@/query/community.query";

export default function CommunityModeratorsPage() {
  const { community: communityName } = useParams();

  const { data: community } = useCommunityByName(
    communityName?.toString() ?? ""
  );

  if (!community) return <Skeleton className="w-full h-5" />;

  return (
    <div className="w-full">
      <AppPageTitle>Mods & Members</AppPageTitle>
      <CommunityMembersTable communityId={community.id} />
    </div>
  );
}
