import db from '../models/db.js';

const postController = {
  // Get all posts
  async getAllPosts(req, res) {
    try {
      const [posts] = await db.execute(`
        SELECT posts.* users.username AS author
        FROM posts
        LEFT JOIN users ON posts.user_id = users.id
      `);
      res.status(200).json({ success: true, data: posts });
    } catch (err) {
      console.error('Error fetching posts:', err.message);
      res.status(500).json({ success: false, error: 'Server error', details: err.message });
    }
  },

  // Create a new post
  async createPost(req, res) {
    const { title, content } = req.body;
    const user_id = req.session?.userId; // Assuming user session contains ID

    if (!user_id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Title and content are required.' });
    }

    try {
      const [result] = await db.execute(
        `INSERT INTO posts (title, content, user_id, created_at)
         VALUES (?, ?, ?, NOW())`,
        [title, content, user_id]
      );
      res.status(201).json({
        success: true,
        message: 'Post created successfully.',
        postId: result.insertId,
      });
    } catch (err) {
      console.error('Error creating post:', err.message);
      res.status(500).json({ success: false, error: 'Failed to create post', details: err.message });
    }
  },

  // Get a post by ID
  async getPostById(req, res) {
    const { id } = req.params;

    try {
      const [posts] = await db.execute(`
        SELECT posts.* users.username AS author
        FROM posts
        LEFT JOIN users ON posts.user_id = users.id
        WHERE posts.id = ?
      `, [id]);

      if (posts.length === 0) {
        return res.status(404).json({ success: false, error: 'Post not found.' });
      }

      res.status(200).json({ success: true, data: posts[0] });
    } catch (err) {
      console.error('Error fetching post by ID:', err.message);
      res.status(500).json({ success: false, error: 'Server error', details: err.message });
    }
  },

  // Update a post
  async updatePost(req, res) {
    const { id } = req.params;
    const { title, content } = req.body;
    const user_id = req.session?.userId;

    if (!user_id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
      const [result] = await db.execute(
        `UPDATE posts
         SET title = ?, content = ?
         WHERE id = ? AND user_id = ?`,
        [title, content, id, user_id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, error: 'Post not found or unauthorized.' });
      }

      res.status(200).json({ success: true, message: 'Post updated successfully.' });
    } catch (err) {
      console.error('Error updating post:', err.message);
      res.status(500).json({ success: false, error: 'Failed to update post', details: err.message });
    }
  },

  // Delete a post
  async deletePost(req, res) {
    const { id } = req.params;
    const user_id = req.session?.userId;

    if (!user_id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
      const [result] = await db.execute(
        `DELETE FROM posts WHERE id = ? AND user_id = ?`,
        [id, user_id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, error: 'Post not found or unauthorized.' });
      }

      res.status(200).json({ success: true, message: 'Post deleted successfully.' });
    } catch (err) {
      console.error('Error deleting post:', err.message);
      res.status(500).json({ success: false, error: 'Failed to delete post', details: err.message });
    }
  },
};

export default postController;

