create table communities
(
    id          UUID         NOT NULL PRIMARY KEY,
    name        VARCHAR(64)  NOT NULL,
    title       VARCHAR(128) NOT NULL,
    description VARCHAR(512),
    visibility  VARCHAR(20)  NOT NULL,
    topic       VARCHAR(32)  NOT NULL,
    is_nsfw     BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    version     BIGINT                DEFAULT 0
);