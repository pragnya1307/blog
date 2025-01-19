const multer = require('multer');
const express = require('express');
const path = require('path');
const mysql2 = require('mysql2');
const app = express();
app.use(express.json());

const database = mysql2.createConnection({
    host:"localhost",
    user:"root",
    password:"pragnya",
    database:"blogdb"
});
database.connect((error) => {
    if(error){
        return console.error(error)
    }
    console.log("Mysql database is connected....")
})

//MIDDLEWARE FOR PARSING THE FORM DETAILS;
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//ROUTE WHICH IS RESPONSIBLE TO DISPLAY HTML FILE
app.get('/',(req,res) => {
    const htmlfile = path.join(__dirname,'../frontend/index.html');
    res.sendFile(htmlfile)
})

//ROUTE FOR HANDLING FORM SUBMISSIONS FOR REGISTER
app.post('/regForm',(req,res) => {
   try{
        const {username,password} = req.body;
        console.log(req.body);
        const SQL_COMMAND = "INSERT INTO users (username,password) VALUES (?,?)";
        database.query(SQL_COMMAND,[username,password],(err,result) => {
            if(err){
                console.error(err);
                return res.send("Registration unsuccessful")
            }
            console.log(result);
            res.send("Registration successful")
        })
   }
   catch(err){
    console.error(err);
    res.send("Registration Unsuccessful")
   }
})

//ROUTE FOR HANDLING LOGIN
app.post('/loginForm', (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(req.body);

        const SQL_COMMAND = "SELECT password FROM users WHERE username = ?";
        
        database.query(SQL_COMMAND, [username], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send("An error occurred during login.");
            }
            
            if (results.length === 0) {
                return res.status(401).send("Invalid username or password.");
            }

            const storedPassword = results[0].password;

            
            if (password === storedPassword) {
                res.send("Login successful");
            } else {
                res.status(401).send("Invalid username or password.");
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred during login.");
    }
});

 //ROUTE FOR HANDLING LOGOUT
 app.post('/logout', (req, res) => {
    try {
        const { username } = req.body; // Use the username for any additional logic
        console.log(`Logout request received for username: ${username}`);

        // No database update needed, just send a success response
        return res.send("Logout successful!");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred during logout.");
    }
});

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'C:/Users/pragn/Desktop/project web/task 4 blog/backend/uploads'); // Directory where images will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// ROUTE FOR HANDLING POSTS
app.post('/postForm', upload.single('image'), (req, res) => {
  const { username, title, content } = req.body;
  const image = `/uploads/${req.file.filename}`;

  const query = 'INSERT INTO posts (username, title, content, image) VALUES (?, ?, ?, ?)';
  db.query(query, [username, title, content, image], (err, result) => {
    if (err) {
      console.error('Error inserting post:', err);
      return res.status(500).send('Failed to create post');
    }
    res.status(201).send('Post created successfully');
  });
});
app.get('/display', (req, res) => {
  const query = 'SELECT username, title, content, image FROM posts ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching posts:', err);
      return res.status(500).send('Error fetching posts');
    }
    res.json(results);
  });
});

//ROUTE FOR DELETING POSTS
app.delete('/postForm', (req, res) => {
  const { post_id } = req.query;
  const SQL_COMMAND = "DELETE FROM posts WHERE post_id = ?";
  database.query(SQL_COMMAND, [post_id], (err, result) => {
    if (err) return res.status(500).send("Failed to delete post");
    if (result.affectedRows === 0) return res.status(404).send("Post not found");
    res.send("Post deleted successfully");
  });
});

//ROUTE FOR UPDATING POSTS
app.put('/postForm', upload.single('image'), (req, res) => {
  const { post_id } = req.query;
  const { title, content } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!post_id) return res.status(400).json({ message: 'Post ID is required' });

  const SQL_COMMAND = `
    UPDATE posts
    SET title = ?, content = ?, image = ?
    WHERE post_id = ?
  `;
  database.query(SQL_COMMAND, [title, content, image, post_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to update post');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Post not found');
    }
    res.send('Post updated successfully');
  });
});

// ROUTE TO FETCH DETAILS OF A SINGLE POST
app.get('/postForm/:post_id', (req, res) => {
  const { post_id } = req.params;
  const SQL_COMMAND = "SELECT * FROM posts WHERE post_id = ?";
  database.query(SQL_COMMAND, [post_id], (err, results) => {
    if (err) return res.status(500).send("Failed to fetch post details");
    if (results.length === 0) return res.status(404).send("Post not found");
    res.json(results[0]);
  });
});
  
// ROUTE FOR DISPLAYING POSTS
app.get('/display', (req, res) => {
  const SQL_COMMAND = "SELECT post_id, title, content, image, created_at FROM posts";
  database.query(SQL_COMMAND, (err, results) => {
    if (err) return res.status(500).send("Error fetching posts");
    res.json(results);
  });
});


app.listen(4000,() => {
    console.log("Server listening...")
})
