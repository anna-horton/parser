const jwt = require('jsonwebtoken')
const express = require('express')
const {Admin, Categories} = require("./schemes");
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
            if (bcrypt.compareSync(req.body.password, user.password)) {
                let token = await jwt.sign({
                    ...user,
                    isLogin: true
                }, process.env.JWT_SECRET, {
                    expiresIn: 60*60
                })
                res.json({
                    code: 200,
                    object: {
                        ...user._doc,
                        isAdmin: true
                    },
                    token
                })
            } else throw {
                code: 401,
                message: 'Пароли не совпадают'
            }
        } else throw{
            code: 404,
            message: 'Такого аккаунта не существует'
        }

        console.log(req.body)
    } catch (err) {
        res.json(err).status(err.code)
    }

})

router.use(async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            let comingToken = req.headers.authorization.slice(6)
            console.log(comingToken)
            const token = await jwt.verify(comingToken, process.env.JWT_SECRET)
            req.user = token._doc
            next()
        } else throw {
            code: 403,
            message: 'Нужна авторизация'
        }
    } catch(err) {
        console.log(err)
        res.json({
            code: 403,
            message: 'Сессия истекла'
        })
    }

})

router.get('/gestures', async (req, res) => {
    try {
        let gestures = await Gestures.find({
            email: req.body.email,
            author:req.user._id
        })
        res.json({
            code: 0,
            array: gestures
        })
    } catch (err) {
        res.json(err).status(err.code)
    }
})

router.get('/categories', async (req, res) => {
    try {
        let categories = await Categories.find({
            email: req.body.email,
            author:req.user._id
        })
        res.json({
            code: 0,
            array: categories
        })
    } catch (err) {
        res.json(err).status(err.code)
    }
})

router.get('/dactyl', async (req, res) => {
    try {
        let dactyl = await Dactyl.find({
            email: req.body.email,
            author:req.user._id
        })
        res.json({
            code: 0,
            array: dactyl
        })
    } catch (err) {
        res.json(err).status(err.code)
    }
})


router.get('/', (req, res) => {
    var decoded = jwt.decode(token);

    if (!req.user.isLogin) throw {
        code: 401,
        message: 'Not authorization'
    }
})


module.exports = router
