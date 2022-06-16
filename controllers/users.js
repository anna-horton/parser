const {Types} = require('mongoose')
const {Users} = require('../schemes')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const get = async (req, res) => {
    if (req.params.id) {
        const id = new Types.ObjectId(req.params.id)
        const object = await Users.findOne({_id: id})
    
        res.json({
            code: 0,
            object
        })
    } else {
        res.json({
            code: 404
        })
    }
}

const list = async (req, res) => {
    if (req.query.name) req.query.name = {$regex: req.query.name}
	const array = await Users.find({
		...req.query
	}).exec()

	res.json({
		code: 0,
		array
	})
}

const create = async (req, res) => {
	const {email, password, name} = req.body
    try {
		const object = await Users.create({
			email, name,
            password: await bcrypt.hash(password, 10)
		})
	
        let token = await jwt.sign({
            ...object._doc,
            isLogin: true
        }, process.env.JWT_SECRET, {
            expiresIn: 60*60
        })
        res.json({
            code: 200,
            object: {
                ...object._doc,
                isAdmin: false
            },
            token
        })
	} catch (err) {
        console.log(err)
		res.json({
			code: 400,
			message: 'Ошибка при создании'
		})
	}
}

const remove = async (req, res) => {
	const id = new Types.ObjectId(req.params.id)
	const object = await Users.deleteOne({
		_id: id
	})

	res.json({
		code: 0,
		object
	})
}

const update = async (req, res) => {
	try {
        if (req.params.id) {
            const id = new Types.ObjectId(req.params.id)

            await Users.updateOne({
                _id: id
            }, {
                $set: {
                    ...req.body
                }
            }).exec()
    
            const object = await Users.findOne({_id: id}).exec()
    
            res.json({
                code: 0,
                object
            })
        } else  res.json({
            code: 404
        })
	} catch (err) {
		res.json({
			code: 400,
			message: 'Ошибка при обновлении'
		})
	}
}

module.exports = {get, list, create, remove, update}