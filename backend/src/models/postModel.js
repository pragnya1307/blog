import Sequelize from 'sequelize';
import db from './db.js';
import User from './userModel.js';

const Post = db.define('post', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

// Establish the relationship: A Post belongs to a User
Post.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

// Sync model with the database
await Post.sync();

export default Post;
