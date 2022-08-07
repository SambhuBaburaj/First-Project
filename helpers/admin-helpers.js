var db = require('../config/connection');
var collection = require('../config/collection');
const bcrypt = require('bcrypt');

module.exports = {
    addAdmin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            adminData.password = await bcrypt.hash(adminData.password, 10);
            db.get().collection(collection.ADMIN_DATA).insertOne(adminData).then((data) => {
                resolve(data);
            })
        })
    },
    getAdmin: (data) => {
        return new Promise(async (resolve, reject) => {
            let response = {};
            let admin = await db.get().collection(collection.ADMIN_DATA).findOne({ userName: data.userName })
            if (admin) {
                bcrypt.compare(data.password, admin.password).then((status) => {
                    if (status) {
                        response.status = true;
                        resolve(response);
                    } else {
                        resolve({ status: false });
                    }
                })
            } else {
                console.log('no user found');
                resolve({ status: false });
            }


        })

    }
}

