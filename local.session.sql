CREATE DATABASE blogdb;
USE blogdb;
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO users (username, password) VALUES
('name1', 'hashed_password1'),
('name2', 'hashed_password2'),
('name3', 'hashed_password3');
SELECT * FROM users;

CREATE TABLE posts (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO posts (title, content) VALUES
('First Blog Post', 'This is the content of the first blog post.'),
('Second Blog Post', 'This is the content of the second blog post.'),
('Third Blog Post', 'This is the content of the third blog post.');
SELECT * FROM posts;