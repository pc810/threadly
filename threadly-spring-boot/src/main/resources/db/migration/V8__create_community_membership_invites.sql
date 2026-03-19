CREATE TABLE community_membership_invites
(
    community_id UUID                      NOT NULL,
    user_id      UUID                      NOT NULL,
    invited_by   UUID                      NOT NULL,
    created_at   TIMESTAMPTZ DEFAULT now() NOT NULL,
    role         VARCHAR(20)               NOT NULL,

    PRIMARY KEY (community_id, user_id),

    CONSTRAINT fk_invite_community
        FOREIGN KEY (community_id)
            REFERENCES communities (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_invite_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_invite_invited_by
        FOREIGN KEY (invited_by)
            REFERENCES users (id)
);