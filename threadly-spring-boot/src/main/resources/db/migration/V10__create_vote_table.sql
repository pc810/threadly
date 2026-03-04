CREATE TABLE votes
(
    comment_id UUID        NOT NULL,
    user_id    UUID        NOT NULL,
    direction  INTEGER    NOT NULL CHECK ( direction IN (-1, 1) ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    version    BIGINT               DEFAULT 0,

    PRIMARY KEY (comment_id, user_id),

    CONSTRAINT fk_votes_comment
        FOREIGN KEY (comment_id) REFERENCES comments (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_votes_users
        FOREIGN KEY (user_id) REFERENCES users (id)
            ON DELETE CASCADE
);