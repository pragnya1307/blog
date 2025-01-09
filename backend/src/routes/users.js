import express from 'express';
const router = express.Router();
import { getAllUsers, createUser, getUserById, updateUser, deleteUser } from '../controllers/userController.js'; // Named imports
import db from 'backend\src\models\db.js';


// Define user-related routes
router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;  // Use export default for the router
