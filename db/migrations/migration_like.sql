
CREATE TABLE likes (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    tweet_id UUID REFERENCES tweets(id) ON DELETE CASCADE,
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (
            tweet_id IS NOT NULL
            AND poll_id IS NULL
            AND comment_id IS NULL
        )
        OR (
            tweet_id IS NULL
            AND poll_id IS NOT NULL
            AND comment_id IS NULL
        )
        OR (
            tweet_id IS NULL
            AND poll_id IS NULL
            AND comment_id IS NOT NULL
        )
    ),
    UNIQUE (user_id, tweet_id)
);