ALTER TABLE communities
    ADD COLUMN topic VARCHAR(32);

UPDATE communities
SET topic='TECHNOLOGY'
WHERE topic IS NULL;

ALTER TABLE communities
    ALTER COLUMN topic SET  NOT NULL;