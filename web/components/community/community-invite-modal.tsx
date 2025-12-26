"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";

import { UserSearchCombobox } from "../user";

interface CommunityInviteModalProps
  extends React.ComponentProps<typeof Dialog> {
  title: string;
}

export const CommunityInviteModal = ({
  title,
  ...props
}: CommunityInviteModalProps) => {
  const [userId, setUserId] = useState<string>("");

  return (
    <Dialog {...props}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <UserSearchCombobox
          value={userId}
          onChange={(v) => v && setUserId(v)}
          options={{ excludeSelf: true }}
        />
      </DialogContent>
    </Dialog>
  );
};
