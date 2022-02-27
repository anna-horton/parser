const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()

const Admin = mongoose.model('Admin', {
    email: String,
    password: String
})


module.exports = {
    Admin
}

const checkAdmin = async () => {
    try {
        const admin = await Admin.findOne({
            email: process.env.ADMIN_EMAIL
        })
        if (!admin) {
            let password = await bcrypt.hash(process.env.ADMIN_PASSWORD, Number(process.env.SALT))
            let r = await Admin.updateOne({
                email: process.env.ADMIN_EMAIL
            }, {
                $set: {
                    email: process.env.ADMIN_EMAIL,
                    password
                }
            }, {
                upsert: true
            })
        }
    } catch (err) {
        console.log(err)
    }

}

checkAdmin()

