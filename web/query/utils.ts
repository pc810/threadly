import { UseQueryResult } from "@tanstack/react-query";

export const QueryKeys = {
  auth: "auth",
  community: "community",
  name: "name",
  membership: "membership",
  feed: "feed",
  media: "media",
  permission: "permission",
  post: "post",
  postLink: "post-link",
  user: "user",
  invite: "invite",
  removeInvite: "invite-remove",
} as const;

export const isLogedIn = (
  auth: UseQueryResult<
    {
      id: string;
      name: string;
    } | null,
    Error
  >
) => !!auth && auth.data != null;
