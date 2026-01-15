CREATE TABLE post_feed
(
    id           BIGSERIAL PRIMARY KEY,
    user_id      UUID        NOT NULL,
    post_id      UUID        NOT NULL,
    created_at   timestamptz NOT NULL,
    community_id UUID        NOT NULL,
    version      BIGINT DEFAULT 0
);