const jwt = require('jsonwebtoken')
const express = require('express')
const {Admin} = require("./schemes");
const router = express.Router()
const bcrypt = require('bcrypt')


router.post('/login', async (req, res) => {
    try {
        if (!req.body.email) throw {
            code: 400,
            message: 'Email обязателен'
        }
        let user = await Admin.findOne({
            email: req.body.email
        })
        if (user) {
            console.log(bcrypt.compareSync(req.body.password, user.password))
            console.log(req.body.password)
            console.log(user.password)
            if (bcrypt.compareSync(req.body.password, user.password)) {
                let token = await jwt.sign({
                    ...user,
                    isLogin: true
                }, process.env.JWT_SECRET, {
                    expiresIn: 60*60
                })
                res.json({
                    code: 200,
                    token
                })
            } else throw {
                code: 401,
                message: 'Пароли не совпадают'
            }
        } else res.json({
            code: 404,
            message: 'Такого аккаунта не существует'
        })

        console.log(req.body)
    } catch (err) {
        res.json(err).status(err.code)
    }

})

router.use(async (req, res, next) => {
    console.log('2112')
    const token = await jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
    console.log('Token')
    console.log(token)
    next()
})



router.get('/', (req, res) => {
    var decoded = jwt.decode(token);

    if (!req.user.isLogin) throw {
        code: 401,
        message: 'Not authorization'
    }
})

router.get('/logout', (req, res) => {

})

module.exports = router
