import express from 'express';
import postController from '../controllers/postController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', postController.getAllPosts); // Get all posts
router.get('/:id', postController.getPostById); // Get a single post by ID

// Protected routes
router.post('/', verifyToken, postController.createPost); // Create a post
router.put('/:id', verifyToken, postController.updatePost); // Update a post
router.delete('/:id', verifyToken, postController.deletePost); // Delete a post

export default router;
