const { response } = require('express');
var express = require('express');
const categoryHelpers = require('../helpers/category-helpers');
const productHelpers = require('../helpers/product-helpers');
// const { response } = require('../app');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers');
var userValidation = require('../helpers/user-validation');
require('dotenv').config()
// const { check, body, validationResult } = require('express-validator');

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

const verifyLogin = (req, res, next) => {
  if (req.session.user) next();
  else res.redirect('/login');
} 

/* GET home page. */
router.get('/', function (req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    res.render('user/index',{products});
  })
  
});

router.post('/register', (req, res) => {
  req.body.block = false;
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
    res.redirect('/user/login')
  })
})

router.get('/login', function (req, res, next) {
  if (req.session.user) {
    res.redirect('/user')
  } else {
    res.render('user/login', { 'loginErr': req.session.userLoginErr,'loginBlocked':req.session.userBlocked });
    req.session.userLoginErr = false;
    req.session.userBlocked = false;
  }
});

router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if(response.block){
      req.session.userBlocked = "Sorry, Your Access has been denied."
      res.redirect('/user/login');
    }else{
      if (response.status) {
        req.session.user = true;
        res.render('user/index')
      } else {
        req.session.userLoginErr = 'Invalid username or password';
        res.redirect('/user/login');
      }
    }
   
  })
})

router.get('/otplogin', (req, res) => {
  res.render('user/otplogin')
})
// router.post('/otp',(req,res)=>{
//   twilio.messages.create({
//     from: "+12515128123",
//     to: "+916238305390",
//     body: "This is a testing"
//   })
//   .then((res)=>console.log('Message has been sent!'))
//   .catch((err)=>console.log(err));
// })
router.post('/getOtp', (req, res) => {
  const mobileNumber =req.body.mobile;
  client.verify.v2.services(process.env.SERVICE_ID)
                .verifications
                .create({to: '+91'+mobileNumber, channel: 'sms'})
                .then((verification) => {
                  res.render('user/otp')
                })
                .catch((err)=>console.log(err));
})
router.post('/verifyOtp',(req,res)=>{
  const mobileNumber = req.body.mobile; 
  const otp = req.body.otp;
  client.verify.v2.services(process.env.SERVICE_ID)
      .verificationChecks
      .create({to: '+91'+mobileNumber, code: otp})
      .then(verification_check => {
        let approved ='approved';
        if(verification_check.status == approved){
          req.session.user = true;
          res.redirect('/user')
        }else{
          req.session.userOTPErr = 'OTP is invalid';
          res.render('user/otp',{'userOTPErr':req.session.userOTPErr})
          req.session.userOTPErr = false;
        }})
      .catch((err)=>{
        console.log('Catch error in otp-'+err); 
      })
})

router.get('/logout', (req, res) => {
  req.session.user = null;
  res.redirect('/user');
})



module.exports = router;
