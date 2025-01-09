import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const db = new Sequelize(process.env.blogdb, process.env.root, process.env.pragnya, {
    host: process.env.localhost,
    dialect: 'mysql',
    port: process.env.DB_33060,
});

export default db;
