ALTER TABLE posts
ADD COLUMN community_id UUID,
ADD CONSTRAINT fk_posts_communities
    FOREIGN KEY (community_id)
    REFERENCES communities(id)
    ON DELETE CASCADE;
