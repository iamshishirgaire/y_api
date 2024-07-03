CREATE TYPE visibility AS ENUM ('public', 'private');

CREATE TABLE tweets (
    id UUID PRIMARY KEY,
    content TEXT NOT NULL,
    media_url TEXT [],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    edited BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    like_count BIGINT NOT NULL DEFAULT 0,
    retweet_count BIGINT NOT NULL DEFAULT 0,
    comment_count BIGINT NOT NULL DEFAULT 0,
    view_count BIGINT NOT NULL DEFAULT 0,
    visibility visibility NOT NULL DEFAULT 'public',
    parent_tweet_id UUID REFERENCES tweets(id) ON DELETE CASCADE,
    UNIQUE(user_id, parent_tweet_id)
);