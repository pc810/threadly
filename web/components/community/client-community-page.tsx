"use client";

import { AppCommunityPostsList } from "@/components/app-post-list";
import { useParams } from "next/navigation";

export function ClientCommunityPage() {
  const { community } = useParams();

  return (
    <div>
      <AppCommunityPostsList communityName={community?.toString()} />
      <AppCommunityPostsList communityName={community?.toString()} />
      <AppCommunityPostsList communityName={community?.toString()} />
      <AppCommunityPostsList communityName={community?.toString()} />
      <AppCommunityPostsList communityName={community?.toString()} />
    </div>
  );
}
