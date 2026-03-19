CREATE TABLE comments
(
    id           UUID        NOT NULL PRIMARY KEY,
    user_id      UUID        NOT NULL,
    post_id      UUID        NOT NULL,
    depth        INTEGER              DEFAULT 0,
    parent_id    UUID                 DEFAULT NULL,
    child_count  INTEGER              DEFAULT 0,
    community_id UUID        NOT NULL,
    up_vote      INTEGER              DEFAULT 0,
    down_vote    INTEGER              DEFAULT 0,
    content_json JSONB       NOT NULL,
    content_text TEXT,
    content_html TEXT,

    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ,
    version      BIGINT               DEFAULT 0,

    CONSTRAINT fk_comments_user
        FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE,

    CONSTRAINT fk_comments_post
        FOREIGN KEY (post_id)
            REFERENCES posts(id)
            ON DELETE CASCADE,

    CONSTRAINT fk_comments_community
        FOREIGN KEY (community_id)
            REFERENCES communities(id)
            ON DELETE CASCADE,

    CONSTRAINT fk_comments_parent
        FOREIGN KEY (parent_id)
            REFERENCES comments(id)
            ON DELETE CASCADE,

    CONSTRAINT chk_comment_depth
        CHECK (depth >= 0),

    CONSTRAINT chk_comment_votes
        CHECK (up_vote >= 0 AND down_vote >= 0)
);