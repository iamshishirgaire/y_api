CREATE TYPE visibility AS ENUM ('public', 'private');


CREATE TABLE tweets (
    id UUID PRIMARY KEY,
    content TEXT NOT NULL,
    mediaUrl TEXT[], 
    createdAt TIMESTAMP NOT NULL,
    edited BOOLEAN DEFAULT FALSE,
    userId UUID REFERENCES users(id) ON DELETE CASCADE,
    visibility visibility NOT NULL default 'public'
);
