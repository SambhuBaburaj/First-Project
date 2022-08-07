var db = require('../config/connection');
var collection = require('../config/collection');
var objectId = require('mongodb').ObjectId;

module.exports = {
    addProducts:(products)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).insertOne(products).then((data)=>{
                resolve(data.insertedId);
            })
        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray();
            resolve(products);
        })
    },
    getProduct:(productId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(productId)}).then((response)=>{
                resolve(response);
            })
        })
    },
    editProduct:(productDetails,productId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id: objectId(productId)},{
                $set:{
                    productName : productDetails.productName,
                    category : productDetails.category,
                    subcategory : productDetails.subcategory,
                    brand : productDetails.brand,
                    price : productDetails.price,
                    description : productDetails.description
                }
            }).then((response)=>{
                resolve(response);
            })
        })
    },

    deleteProduct:(productId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(productId)}).then((response)=>{
                resolve(response);
            })
        })
    }, 
    
}

