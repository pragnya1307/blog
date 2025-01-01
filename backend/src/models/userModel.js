import Sequelize from 'sequelize';
import db from './db.js';

const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

// Establish the relationship: A User has many Posts
User.hasMany(db.models.post, {
    foreignKey: 'userId',
    as: 'posts',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

// Sync model with the database
await User.sync();

export default User;
