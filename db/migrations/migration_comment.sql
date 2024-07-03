drop table if exists comments;

CREATE TABLE comments (
    id UUID PRIMARY KEY,
    content TEXT NOT NULL,
    media_url TEXT [],
    tweet_id UUID REFERENCES tweets(id) ON DELETE CASCADE,
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    reply_to_id UUID REFERENCES comments(id) ON DELETE CASCADE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (
            tweet_id IS NOT NULL
            AND poll_id IS NULL
        )
        OR (
            tweet_id IS NULL
            AND poll_id IS NOT NULL
        )
    )
);