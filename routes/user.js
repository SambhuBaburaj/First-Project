const { response } = require('express');
var express = require('express');
// const { response } = require('../app');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers');
// const { check, body, validationResult } = require('express-validator');

const verifyLogin = (req,res,next)=>{
  if(req.session.user) next();
  else res.redirect('/login');
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('user/index');
});
  

router.post('/register',(req,res) =>{
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response);
  })
}) 

router.get('/login', function(req, res, next) {
  if(req.session.user){
    res.redirect('/user')
  }else{
    res.render('user/login',{'loginErr' : req.session.userLoginErr});
    req.session.userLoginErr = false;
  } 
});

router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.user = true;
       res.render('user/myAccount')
    }else{
      req.session.userLoginErr = 'Invalid username or password';
      res.redirect('/user/login');
    }
  })
})

router.get('/logout',(req,res)=>{
  req.session.user = null;
  res.redirect('/user');
})



module.exports = router;
