create table hash_tags (
    id UUID primary key,
    hashtag varchar(255) not null unique,
    count bigint default 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD CONSTRAINT no_double_spaces CHECK (hashtag !~ '  ')
);
