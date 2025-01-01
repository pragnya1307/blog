import express from 'express';
import session from 'express-session';
import SequelizeStoreInit from 'connect-session-sequelize';
import db from './src/models/db.js';
import authRoutes from './src/routes/auth.js';
import postRoutes from './src/routes/posts.js';
import userRoutes from './src/routes/users.js';

const app = express();
const PORT = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
const SequelizeStore = SequelizeStoreInit(session.Store);
const sessionStore = new SequelizeStore({ db });

app.use(session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

sessionStore.sync();

// Routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => res.send('Welcome to the Blog!'));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
