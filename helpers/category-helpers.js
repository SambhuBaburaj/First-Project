var db = require('../config/connection');
var collection = require('../config/collection');
var objectId = require('mongodb').ObjectId;

module.exports ={
    getAllCategories:()=>{
        return new Promise(async(resolve,reject)=>{
            let categories = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray();
            resolve(categories);
        })
    },
    addCategory: (newCategory)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.CATEGORY_COLLECTION).insertOne(newCategory).then((data)=>{
                resolve(data.insertedId);
            })
        })
    },
    getSubCategory:()=>{
        return new Promise(async(resolve,reject)=>{
            let subCategory = await db.get().collection(collection.CATEGORY_COLLECTION).aggregate(
                [{$match:{category:"Travel"}},{$unwind:"$subCategory"},{$project:{subCategory:1}}]
            ).toArray();
            resolve(subCategory);
        })



        // db.get().collection(collection.CATEGORY_COLLECTION).aggregate(
        //     [{$match:{category:"Travel"}},{$unwind:"$subCategory"},{$project:{"subCategory":1}}]
        // )
    }
    

}