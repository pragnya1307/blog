CREATE DATABASE blogdb;
USE blogdb;
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT * FROM users;
CREATE TABLE posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- This references the user who created the post
    username VARCHAR(200) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    image VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) -- Assuming a users table exists
);
SELECT * FROM posts;
