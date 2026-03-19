CREATE TABLE post_feed
(
    id           BIGSERIAL PRIMARY KEY,
    user_id      UUID        NOT NULL,
    post_id      UUID        NOT NULL,
    created_at   timestamptz NOT NULL,
    community_id UUID        NOT NULL,
    version      BIGINT DEFAULT 0,


    CONSTRAINT fk_post_feed_post
        FOREIGN KEY (post_id)
            REFERENCES posts (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_post_feed_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_post_feed_community
        FOREIGN KEY (community_id)
            REFERENCES communities (id)
);