CREATE TABLE post_feed
(
    id         BIGSERIAL PRIMARY KEY,
    user_id    UUID        NOT NULL,
    post_id    UUID        NOT NULL,
    created_at timestamptz NOT NULL,
    version    BIGINT default 0
);