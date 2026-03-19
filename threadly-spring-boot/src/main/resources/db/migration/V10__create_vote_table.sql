CREATE TABLE votes
(
    id         UUID        NOT NULL,
    user_id    UUID        NOT NULL,
    comment_id UUID,
    post_id    UUID,
    direction  INTEGER     NOT NULL CHECK (direction IN (-1, 1)),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    version    BIGINT               DEFAULT 0,

    CONSTRAINT pk_votes PRIMARY KEY (id),

    CONSTRAINT fk_votes_comment
        FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE,

    CONSTRAINT fk_votes_users
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,

    CONSTRAINT vote_target_check
        CHECK (
            (post_id IS NOT NULL AND comment_id IS NULL) OR
            (post_id IS NULL AND comment_id IS NOT NULL)
            )
);

CREATE UNIQUE INDEX idx_votes_user_post ON votes (user_id, post_id) WHERE post_id IS NOT NULL;
CREATE UNIQUE INDEX idx_votes_user_comment ON votes (user_id, comment_id) WHERE comment_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_vote_post ON votes (post_id);
CREATE INDEX IF NOT EXISTS idx_vote_comment ON votes (comment_id);