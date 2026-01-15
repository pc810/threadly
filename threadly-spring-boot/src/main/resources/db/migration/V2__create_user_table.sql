create table users
(
    id            UUID        NOT NULL PRIMARY KEY,
    username      VARCHAR(64),
    email         VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    auth_provider VARCHAR(32) NOT NULL,
    provider_id   VARCHAR(255),
    status        VARCHAR(32) NOT NULL,
    version       BIGINT               DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_login_at TIMESTAMPTZ
);