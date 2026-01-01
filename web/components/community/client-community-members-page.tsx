"use client";

import { useParams, useRouter } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { AppPageTitle } from "@/components/app-page-title";
import { CommunityMembersTable } from "@/components/community";

import {
  useCommunityByName,
  useCommunityInvite,
} from "@/query/community.query";
import { Community, InviteUserDTO } from "@/types";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { getCommunityModLink } from "@/lib/format";
import { useState } from "react";
import { CommunityInviteModal } from "./community-invite-modal";
import { CommunityInvitesTable } from "./community-invites-table";

const COMMUNITY_MEMBERS_PAGE = {
  Moderators: "Moderators",
  ApprovedUsers: "ApprovedUsers",
  Invites: "Invites",
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
      {type == COMMUNITY_MEMBERS_PAGE.Invites && (
        <InvitedUsers community={community} />
      )}
    </div>
  );
}

const Moderator = ({ community }: { community: Community }) => {
  const [openInviteMod, setOpenInviteMod] = useState(false);

  const { mutateAsync: inviteUserToCommunity, isPending } = useCommunityInvite(
    community.id
  );

  const handleInviteUser = async (payload: InviteUserDTO) => {
    await inviteUserToCommunity(payload);
    setOpenInviteMod(false);
  };

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
        onSuccess={handleInviteUser}
        isPending={isPending}
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

const InvitedUsers = ({ community }: { community: Community }) => {
  return (
    <>
      <CommunityMembersTabs defaultValue="Invites" className="mb-4" />
      <CommunityInvitesTable communityId={community.id} />
    </>
  );
};

const CommunityMembersTabs = ({
  defaultValue,
  className,
}: {
  defaultValue: CommunityMembersPageType;
  className?: string;
}) => {
  const router = useRouter();
  const { community } = useParams();
  return (
    <Tabs
      className={className}
      defaultValue={defaultValue}
      onValueChange={(updatedValue) =>
        router.push(
          `${getCommunityModLink(`${community}`)}/${
            updatedValue == "ApprovedUsers"
              ? "approved-users"
              : updatedValue == "Invites"
              ? "invites"
              : "moderators"
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
        <TabsTrigger value={COMMUNITY_MEMBERS_PAGE.Invites}>
          Invites
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
