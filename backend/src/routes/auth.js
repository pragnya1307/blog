// Required Dependencies
import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import Sequelize from 'sequelize';
import connectSessionSequelize from 'connect-session-sequelize';

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs'); // Assuming EJS for templating

// Database Connection
const { Sequelize: SequelizeConstructor } = Sequelize;
const db = new SequelizeConstructor('blog_db', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

// Session Store
const SequelizeStore = connectSessionSequelize(session.Store);
const sessionStore = new SequelizeStore({ db });

app.use(session({
    secret: 'your_secret_key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));
sessionStore.sync();

// User and Post Models
const User = db.define('user', {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const Post = db.define('post', {
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

User.hasMany(Post);
Post.belongsTo(User);

// Sync Database
db.sync();

// Middleware to Protect Routes
const ensureAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Routes

// Home Route (Protected)
app.get('/', ensureAuthenticated, async (req, res) => {
    const posts = await Post.findAll({ include: User });
    res.render('homepage', { posts });
});

// Registration Route
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashedPassword });
        res.redirect('/login');
    } catch (err) {
        res.status(500).send('Error registering user.');
    }
});

// Login Route
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user.id;
            res.redirect('/');
        } else {
            res.status(401).send('Invalid credentials.');
        }
    } catch (err) {
        res.status(500).send('Error logging in.');
    }
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error logging out.');
        }
        res.redirect('/login');
    });
});

// Post Content Route
app.post('/post', ensureAuthenticated, async (req, res) => {
    const { content } = req.body;
    try {
        await Post.create({
            content,
            userId: req.session.userId
        });
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Error posting content.');
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
