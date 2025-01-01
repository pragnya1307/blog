import Post from '../models/postModel.js';

// Create a new post
export const createPost = async (req, res) => {
    const { content } = req.body;
    try {
        const post = await Post.create({ content, userId: req.session.userId });
        res.status(201).json(post);
    } catch (err) {
        res.status(500).send('Error creating post');
    }
};

// Get all posts (with user's posts only)
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({ include: 'user' });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).send('Error fetching posts');
    }
};

// Get a single post by ID
export const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findOne({ where: { id, userId: req.session.userId } });
        if (!post) {
            return res.status(404).send('Post not found or unauthorized');
        }
        res.status(200).json(post);
    } catch (err) {
        res.status(500).send('Error fetching post');
    }
};

// Update a post by ID
export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
        const post = await Post.findOne({ where: { id, userId: req.session.userId } });
        if (!post) {
            return res.status(404).send('Post not found or unauthorized');
        }
        post.content = content;
        await post.save();
        res.status(200).json(post);
    } catch (err) {
        res.status(500).send('Error updating post');
    }
};

// Delete a post by ID
export const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findOne({ where: { id, userId: req.session.userId } });
        if (!post) {
            return res.status(404).send('Post not found or unauthorized');
        }
        await post.destroy();
        res.status(200).send('Post deleted successfully');
    } catch (err) {
        res.status(500).send('Error deleting post');
    }
};
