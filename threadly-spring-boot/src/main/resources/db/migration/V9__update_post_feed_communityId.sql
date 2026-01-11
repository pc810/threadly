ALTER TABLE post_feed
    ADD COLUMN community_id uuid;

UPDATE post_feed pf
SET community_id = p.community_id
FROM posts p
WHERE pf.post_id = p.id;

SELECT COUNT(*)
FROM post_feed
WHERE community_id IS NULL;

ALTER TABLE post_feed
    ALTER COLUMN community_id SET NOT NULL;