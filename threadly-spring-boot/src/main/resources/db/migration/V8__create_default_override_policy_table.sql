CREATE TABLE default_policy(
  permission_key VARCHAR(50) PRIMARY KEY
);

CREATE TABLE default_policy_roles(
  permission_key VARCHAR(50) NOT NULL,
  role VARCHAR(50) NOT NULL,
  PRIMARY KEY (permission_key,role)
);

ALTER TABLE default_policy_roles
ADD CONSTRAINT fk_default_policy
      FOREIGN KEY (permission_key) REFERENCES default_policy(permission_key) ON DELETE CASCADE;


INSERT INTO default_policy (permission_key) VALUES
('COMMUNITY_VIEW'),
('COMMUNITY_ADD'),
('COMMUNITY_EDIT'),
('COMMUNITY_DELETE'),
('COMMUNITY_MEMBERSHIP_VIEW'),
('COMMUNITY_MEMBERSHIP_ADD'),
('COMMUNITY_MEMBERSHIP_EDIT'),
('COMMUNITY_MEMBERSHIP_DELETE'),
('POST_VIEW');

INSERT INTO default_policy_roles (permission_key, role) VALUES

-- Anyone on the internet can view public communities
('COMMUNITY_VIEW','PUBLIC'),
('COMMUNITY_VIEW','USER'),
('COMMUNITY_VIEW','MEMBER'),
('COMMUNITY_VIEW','MOD'),
('COMMUNITY_VIEW','AUTHOR'),

-- Any logged-in user can create a community
('COMMUNITY_ADD','USER'),

-- Only mods + owners can edit community settings
('COMMUNITY_EDIT','MOD'),
('COMMUNITY_EDIT','AUTHOR'),

-- Only the owner can delete the community
('COMMUNITY_DELETE','AUTHOR'),

-- Membership list: PUBLIC cannot see members (privacy)
('COMMUNITY_MEMBERSHIP_VIEW','MEMBER'),
('COMMUNITY_MEMBERSHIP_VIEW','MOD'),
('COMMUNITY_MEMBERSHIP_VIEW','AUTHOR'),

-- Add new members = mods + owner
('COMMUNITY_MEMBERSHIP_ADD','MOD'),
('COMMUNITY_MEMBERSHIP_ADD','AUTHOR'),

-- Edit membership roles = mods + owner
('COMMUNITY_MEMBERSHIP_EDIT','MOD'),
('COMMUNITY_MEMBERSHIP_EDIT','AUTHOR'),

-- Remove members = mods + owner
('COMMUNITY_MEMBERSHIP_DELETE','MOD'),
('COMMUNITY_MEMBERSHIP_DELETE','AUTHOR'),

-- Anyone can view posts in a public community
('POST_VIEW','PUBLIC'),
('POST_VIEW','USER'),
('POST_VIEW','MEMBER'),
('POST_VIEW','MOD'),
('POST_VIEW','AUTHOR');

CREATE TABLE override_policy(
 id UUID PRIMARY KEY NOT NULL,
  permission_key VARCHAR(50) NOT NULL,
  role VARCHAR(50) NOT NULL,
  resourceId VARCHAR(255) NOT NULL
);