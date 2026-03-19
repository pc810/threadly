create table community_memberships
(
    community_id UUID                      NOT NULL,
    user_id      UUID                      NOT NULL,
    added_by     UUID                      NOT NULL,
    role         VARCHAR(20)               NOT NULL,
    created_at   TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at   TIMESTAMPTZ DEFAULT now() NOT NULL,

    PRIMARY KEY (community_id, user_id),

    CONSTRAINT fk_membership_community
        FOREIGN KEY (community_id)
            REFERENCES communities (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_membership_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_membership_added_by
        FOREIGN KEY (added_by)
            REFERENCES users (id)
);
