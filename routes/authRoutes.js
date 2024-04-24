const {signup_get,signup_post,login_get,login_post,logout_get}=require('../controllers/authController');
const express=require('express');

const router=express.Router();

router.route('/signup').get(signup_get).post(signup_post);
router.route('/login').get(login_get).post(login_post);
router.route('/logout').get(logout_get);

module.exports=router