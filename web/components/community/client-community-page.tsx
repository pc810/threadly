"use client";

import { AppCommunityPostsList } from "@/components/app-post-list";
import { useParams } from "next/navigation";

export function ClientCommunityPage() {
  const { community } = useParams();

  return <AppCommunityPostsList communityName={community?.toString()} />;
}
