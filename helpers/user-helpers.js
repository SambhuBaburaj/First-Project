var db = require('../config/connection');
var collection = require('../config/collection');
const bcrypt = require('bcrypt');
// const { body,check, validationResult } = require('express-validator');


module.exports = {
    doSignup: (userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.password = await bcrypt.hash(userData.password,10);
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data);    
            })
        })
    },
    doLogin:(userData)=>{      
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false;
            let response = {};
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        console.log('login success');
                        response.user = user;
                        response.status = true;
                        resolve(response);
                    }else{
                        console.log('login failed');
                        resolve({status:false});
                    }
                })
            }else{
                console.log('no user found');
                resolve({status:false});
            }
        })
    }
}
    