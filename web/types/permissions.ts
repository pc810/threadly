export type ResourcePermission = {
  SYS: "USER" | "AUTH" | "ADMIN";
  COMMUNITY:
    | "VIEW"
    | "UPDATE"
    | "DELETE"
    | "ADD_POST"
    | "CAN_FOLLOW"
    | "CAN_UNFOLLOW"
    | "FOLLOWER"
    | "OWNER_PRIVILEGE";
  POST: "VIEW" | "UPDATE" | "REMOVE";
};

export type ResourceType = keyof ResourcePermission;
export const ResourceTypeEnum = {
  SYS: "SYS",
  COMMUNITY: "COMMUNITY",
  POST: "POST",
};

export type PermissionResult<P extends readonly string[]> = {
  [K in P[number]]: boolean | undefined;
};
