const jwt = require("jsonwebtoken");
require("dotenv").config();
const User=require('../models/User');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, (err, data) => {
      if (err) {
        res.redirect("/login");
      } else {
        console.log(data);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, async(err, data) => {
      if (err) {
        res.loacls.user=null
        console.log(err.message)
        next();
      } else {
        const user=await User.findById(data.id);
        res.locals.user=user
        next();
      }
    });
  } else {
    res.locals.user=null;
    next();
  }
};

module.exports = { requireAuth,checkUser };
