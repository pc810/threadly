create table posts
(
    id           UUID         NOT NULL PRIMARY KEY,
    user_id      UUID         NOT NULL,
    community_id UUID,
    title        VARCHAR(255) NOT NULL,
    type         VARCHAR(20)  NOT NULL,

    content_json JSONB        NOT NULL,
    content_text TEXT,
    content_html TEXT,
    link         TEXT,
    up_vote      INTEGER              DEFAULT 0,
    down_vote    INTEGER              DEFAULT 0,

    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ,
    version      BIGINT                DEFAULT 0,

    CONSTRAINT fk_posts_communities
        FOREIGN KEY (community_id)
            REFERENCES communities (id)
            ON DELETE CASCADE
);