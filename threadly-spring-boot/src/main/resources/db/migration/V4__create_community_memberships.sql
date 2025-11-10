create table community_memberships (
    community_id UUID NOT NULL,
    user_id UUID NOT NULL,
    added_by UUID NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at timestamptz DEFAULT NOW() NOT NULL,
    updated_at timestamptz DEFAULT NOW() NOT NULL,
    PRIMARY KEY (community_id, user_id)
);
