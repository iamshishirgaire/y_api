CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    bio TEXT ,
    firstName VARCHAR(255) ,
    lastName VARCHAR(255) ,
    country VARCHAR(255) ,
    dob DATE ,
    following INT NOT NULL default 0,
    followers INT NOT NULL default 0,
    profilePicture VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP NOT NULL default CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL default CURRENT_TIMESTAMP
);
