var db = require('../config/connection');
var collection = require('../config/collection');
const bcrypt = require('bcrypt');
var objectId = require('mongodb').ObjectId;
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
                if(user.block){
                    response.block = true;
                    resolve(response);
                }else{
                    bcrypt.compare(userData.password,user.password).then((status)=>{
                        if(status){
                            console.log('login success');
                            response.user = user;
                            console.log(user.mobile)
                            response.status = true;
                            resolve(response);
                        }else{
                            console.log('login failed');
                            resolve({status:false});
                        }
                    })
                }  
            }else{
                console.log('no user found');
                resolve({status:false});
            }
        })
    },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users = await db.get().collection(collection.USER_COLLECTION).find().toArray();
            resolve(users);
        })
    },
    blockUser:(userId)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.USER_COLLECTION).updateOne({_id: objectId(userId)},{
                    $set:{
                        block : true
                    }
                }).then((response)=>{
                    resolve(response);
                })
            })
        },
        unblockUser:(userId)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.USER_COLLECTION).updateOne({_id: objectId(userId)},{
                    $set:{
                        block : false
                    }
                }).then((response)=>{
                    resolve(response);
                })
            })
        }
    
}
    