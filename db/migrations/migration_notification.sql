CREATE TYPE  notification_type AS ENUM ('verified', 'mentions');
CREATE TYPE  content_type AS ENUM ('tweet', 'poll');
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    notif_type notification_type NOT NULL,
    post_type content_type NOT NULL,
    poll_id UUID  REFERENCES polls(id) ON DELETE CASCADE,
    tweet_id UUID  REFERENCES tweets(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    seen BOOLEAN DEFAULT FALSE,
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