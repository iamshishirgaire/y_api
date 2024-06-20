CREATE TABLE polls (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id)  ON DELETE CASCADE NOT NULL,
    description TEXT,
    options TEXT[] NOT NULL,
    visibility visibility NOT NULL DEFAULT 'public',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
