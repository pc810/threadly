CREATE TABLE community_membership_invites
(
    community_id UUID                      NOT NULL,
    user_id      UUID                      NOT NULL,
    invited_by   UUID                      NOT NULL,
    created_at   TIMESTAMPTZ DEFAULT now() NOT NULL,
    role         VARCHAR(20)               NOT NULL,
    PRIMARY KEY (community_id, user_id)
);