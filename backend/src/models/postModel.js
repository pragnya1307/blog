import { DataTypes } from 'sequelize';
import db from './db.js';
import User from './userModel.js';

const Post = db.define('Post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  timestamps: true,
});

Post.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Post, { foreignKey: 'user_id' });

export default Post;
