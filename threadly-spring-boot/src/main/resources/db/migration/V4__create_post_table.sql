create table posts(
id UUID not null primary key,
user_id UUID not null,
title varchar(255) not null,
type varchar(20) not null,

content_json jsonb not null,
content_text text,
content_html text,
link text,

created_at timestamptz not null default now(),
updated_at timestamptz,
version bigint default 0
);

ALTER TABLE posts
    ADD COLUMN community_id UUID,
ADD CONSTRAINT fk_posts_communities
    FOREIGN KEY (community_id)
    REFERENCES communities(id)
    ON DELETE CASCADE;
