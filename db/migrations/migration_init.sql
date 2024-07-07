
alter table users()
ADD CONSTRAINT no_double_spaces CHECK (user_name !~ '  ');

CREATE TABLE users (
    id UUID PRIMARY KEY,
    user_name TEXT NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    country VARCHAR(255),
    dob DATE,
    following INT NOT NULL DEFAULT 0,
    followers INT NOT NULL DEFAULT 0,
    profile_picture VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT single_word_check CHECK (user_name ~ '^\w+$')

);
