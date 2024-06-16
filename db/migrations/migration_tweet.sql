CREATE TYPE visibility AS ENUM ('public', 'private');


CREATE TABLE tweets (
    id UUID PRIMARY KEY,
    content TEXT NOT NULL,
    media_url TEXT[], 
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    edited BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    visibility visibility NOT NULL DEFAULT 'public'
);
