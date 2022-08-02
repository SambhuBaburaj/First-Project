const { response } = require('express');
var express = require('express');
// const { response } = require('../app');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers');
require('dotenv').config()
// const { check, body, validationResult } = require('express-validator');

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

const verifyLogin = (req, res, next) => {
  if (req.session.user) next();
  else res.redirect('/login');
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('user/index');
});


router.post('/register', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
  })
})

router.get('/login', function (req, res, next) {
  if (req.session.user) {
    res.redirect('/user')
  } else {
    res.render('user/login', { 'loginErr': req.session.userLoginErr });
    req.session.userLoginErr = false;
  }
});

router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = true;
      res.render('user/myAccount')
    } else {
      req.session.userLoginErr = 'Invalid username or password';
      res.redirect('/user/login');
    }
  })
})

router.get('/otp', (req, res) => {
  res.render('user/otp')
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
                  console.log('verification.status');
                  console.log(verification.status);
                  console.log('verification.status');
                  res.redirect('/user/otp')
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
          // console.log(verification_check.status);
          req.session.user = true;
          res.redirect('/user')
        }else{
          // console.log(verification_check.status);
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
