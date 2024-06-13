CREATE TYPE notificationType AS ENUM ('verified', 'mentions');
CREATE TYPE contentType AS ENUM ('tweet', 'poll');

CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    notifType notificationType NOT NULL,
    postType contentType NOT NULL,
    contentId UUID,
    message TEXT,
    userId UUID REFERENCES users(id),
    seen BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);
