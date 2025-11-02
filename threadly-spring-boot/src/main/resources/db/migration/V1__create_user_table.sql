create table users(
id UUID not null primary key,
username varchar(64),
email varchar(255) unique,
password_hash varchar(255),
auth_provider varchar(32) not null,
provider_id varchar(255),
status varchar(32) not null,
version bigint default 0,
created_at timestamptz not null default now(),
last_login_at timestamptz
);