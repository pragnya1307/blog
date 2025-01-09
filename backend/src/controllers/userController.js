import bcrypt from 'bcrypt';
import { db } from '../models/db.js';

export const registerUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if username already exists
        const [existingUser] = await db.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        if (existingUser.length) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 6);

        // Insert the user into the database
        await db.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
};
export const loginUser = async (req, res) => {
    const { password } = req.body;

    try {

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
};
