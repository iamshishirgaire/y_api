create table followers(
    id UUID primary key,
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    followee_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, followee_id)
);