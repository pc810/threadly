CREATE TABLE medias (
    id UUID PRIMARY KEY,
    post_id UUID NOT NULL,
    provider VARCHAR(255) NOT NULL,
    base_path VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    content_type VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE post_links (
    id UUID PRIMARY KEY,
    post_id UUID NOT NULL,
    media_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_post_links_media
        FOREIGN KEY (media_id)
        REFERENCES medias(id)
        ON DELETE CASCADE
);
