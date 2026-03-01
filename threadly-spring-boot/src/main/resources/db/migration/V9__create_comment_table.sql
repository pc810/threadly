CREATE TABLE comments
(
    id           UUID        NOT NULL PRIMARY KEY,
    user_id      UUID        NOT NULL,
    post_id      UUID        NOT NULL,
    depth        INTEGER              default 0,
    parent_id    UUID                 default NULL,
    community_id   UUID        NOT NULL,

    content_json JSONB       NOT NULL,
    content_text TEXT,
    content_html TEXT,

    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ,
    version      BIGINT               DEFAULT 0,

    CONSTRAINT fk_comments_parent
        FOREIGN KEY (parent_id)
            REFERENCES comments (id)
            ON DELETE CASCADE
);