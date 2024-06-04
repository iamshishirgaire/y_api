CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255), 
    email VARCHAR(255) NOT NULL,
    bio TEXT ,
    firstName VARCHAR(255) ,
    lastName VARCHAR(255) ,
    country VARCHAR(255) ,
    dob DATE ,
    following INT NOT NULL default 0,
    followers INT NOT NULL default 0,
    profilePicture VARCHAR(255),
    createdAt TIMESTAMP NOT NULL,
    updatedAt TIMESTAMP NOT NULL
);
