const express = require('express');
const mongoose = require('mongoose');
const router=require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const {requireAuth,checkUser}=require('./middleware/authMiddleware.js')
const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb://localhost:27017/jwt-project';
mongoose.connect(dbURI)
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get("*",checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireAuth ,(req, res) => res.render('smoothies'));
app.use('/',router)
