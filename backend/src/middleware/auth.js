import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach user data to request object
    next();
  } catch (err) {
    res.status(403).json({ error: 'Unauthorized: Invalid token' });
  }
};

export default verifyToken;

export const authenticate = (req, res, next) => {
  if (!req.session?.userId) {
      return res.status(401).send('Unauthorized');
  }
  next();
};
