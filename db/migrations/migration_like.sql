CREATE TABLE likes (
    id UUID PRIMARY KEY,
    user_id  UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    tweet_id UUID REFERENCES tweets(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, tweet_id)  -- Composite unique constraint
);