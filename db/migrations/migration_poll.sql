create table poll (
id UUID PRIMARY KEY,
userId UUID REFERENCES users(id) ON DELETE CASCADE,
title TEXT NOT NULL,
description TEXT,
options TEXT[] NOT NULL,
visibility visibility NOT NULL default 'public',
createdAt TIMESTAMP NOT NULL default CURRENT_TIMESTAMP,
updatedAt TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);

create table pollResults(
id UUID PRIMARY KEY,
pollId UUID REFERENCES poll(id) ON DELETE CASCADE,
voteOption Int NOT NULL,
createdAt TIMESTAMP NOT NULL default CURRENT_TIMESTAMP,
updatedAt TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);
