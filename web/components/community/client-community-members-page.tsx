"use client";

import { useParams, useRouter } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { AppPageTitle } from "@/components/app-page-title";
import { CommunityMembersTable } from "@/components/community";

import { useCommunityByName } from "@/query/community.query";
import { Community } from "@/types";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { getCommunityModLink } from "@/lib/format";
import { useState } from "react";
import { CommunityInviteModal } from "./community-invite-modal";

const COMMUNITY_MEMBERS_PAGE = {
  Moderators: "Moderators",
  ApprovedUsers: "ApprovedUsers",
};

type CommunityMembersPageType = keyof typeof COMMUNITY_MEMBERS_PAGE;

type ClientCommunityMembersPageProps = {
  type: CommunityMembersPageType;
};

export function ClientCommunityMembersPage({
  type,
}: ClientCommunityMembersPageProps) {
  const { community: communityName } = useParams();

  const { data: community } = useCommunityByName(
    communityName?.toString() ?? ""
  );

  if (!community) return <Skeleton className="w-full h-5" />;

  return (
    <div className="w-full">
      <AppPageTitle>Mods & Members</AppPageTitle>
      {type == COMMUNITY_MEMBERS_PAGE.Moderators && (
        <Moderator community={community} />
      )}
      {type == COMMUNITY_MEMBERS_PAGE.ApprovedUsers && (
        <ApprovedUsers community={community} />
      )}
    </div>
  );
}

const Moderator = ({ community }: { community: Community }) => {
  const [openInviteMod, setOpenInviteMod] = useState(false);
  return (
    <>
      <CommunityMembersTabs defaultValue="Moderators" />
      <div className="flex justify-end w-full mb-4">
        <Button size="lg" onClick={() => setOpenInviteMod(true)}>
          <Plus /> Invite Mod
        </Button>
      </div>
      <CommunityMembersTable communityId={community.id} role={"MOD"} />
      <CommunityInviteModal
        title="Invite Mod"
        open={openInviteMod}
        onOpenChange={setOpenInviteMod}
      />
    </>
  );
};

const ApprovedUsers = ({ community }: { community: Community }) => {
  return (
    <>
      <CommunityMembersTabs defaultValue="ApprovedUsers" />
      <p className="text-muted-foreground py-4 text-sm">
        Approved users are trusted members in your community. Depending on your
        community setup, approved users would not be filtered by certain
        restrictions in case you set them up.
      </p>
      <div className="flex justify-end w-full mb-4">
        <Button size="lg">
          <Plus /> Add Approved User
        </Button>
      </div>
      <CommunityMembersTable communityId={community.id} role={"MEMBER"} />
    </>
  );
};

const CommunityMembersTabs = ({
  defaultValue,
}: {
  defaultValue: CommunityMembersPageType;
}) => {
  const router = useRouter();
  const { community } = useParams();
  return (
    <Tabs
      defaultValue={defaultValue}
      onValueChange={() =>
        router.push(
          `${getCommunityModLink(`${community}`)}/${
            defaultValue != "ApprovedUsers" ? "approved-users" : "moderators"
          }`
        )
      }
    >
      <TabsList>
        <TabsTrigger value={COMMUNITY_MEMBERS_PAGE.Moderators}>
          Moderators
        </TabsTrigger>
        <TabsTrigger value={COMMUNITY_MEMBERS_PAGE.ApprovedUsers}>
          Approved Users
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
