"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import React, { useEffect, useState } from "react";

import { COMMUNITY_ROLE, InviteUserDTO, UserDTO } from "@/types";
import { UserCombobox } from "@/components/user";

interface CommunityInviteModalProps
  extends React.ComponentProps<typeof Dialog> {
  title: string;
  isPending?: boolean;
  onSuccess: (payload: InviteUserDTO) => Promise<void>;
}

export const CommunityInviteModal = ({
  title,
  onSuccess,
  isPending,
  ...props
}: CommunityInviteModalProps) => {
  const [selectedUser, setSelectedUser] = React.useState<UserDTO | null>(null);

  const withOpenValueChange = (v: boolean) => {
    props.onOpenChange?.(v);
    if (!v) setSelectedUser(null);
  };

  return (
    <Dialog {...props} onOpenChange={withOpenValueChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <UserCombobox
          value={selectedUser?.id}
          onChange={setSelectedUser}
          options={{ excludeSelf: true }}
        />

        <Button
          disabled={!selectedUser}
          onClick={() =>
            selectedUser &&
            onSuccess({ userId: selectedUser.id, role: COMMUNITY_ROLE.MOD })
          }
        >
          {isPending && <Spinner />}
          Invite
        </Button>
      </DialogContent>
    </Dialog>
  );
};
