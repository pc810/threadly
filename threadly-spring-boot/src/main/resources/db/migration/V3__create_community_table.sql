create table communities(
id UUID not null primary key,
name varchar(64) not null,
title varchar(128) not null,
description varchar(512),
visibility varchar(20) not null,
is_nsfw boolean not null default false,
created_at timestamptz not null default now(),
updated_at timestamptz not null default now(),
version bigint default 0
);