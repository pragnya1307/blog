import express from 'express';
const router = express.Router();
import postController from '../controllers/postController.js';
import db from './db.js';


// Example: Get all posts
router.get('/', async (req, res) => {
    try {
        const [posts] = await db.execute(`
            SELECT posts.*, categories.name AS category_name, users.username AS author
            FROM posts
            LEFT JOIN categories ON posts.category_id = categories.id
            LEFT JOIN users ON posts.user_id = users.id
        `);
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});


// Define post-related routes
router.get('/', postController.getAllPosts);
router.post('/', postController.createPost);
router.get('/:id', postController.getPostById);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

export default router;
