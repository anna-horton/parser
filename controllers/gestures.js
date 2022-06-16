const {Types} = require('mongoose')
const {Gestures} = require('../schemes')

const get = async (req, res) => {
    if (req.params.id) {
        const id = new Types.ObjectId(req.params.id)
        const object = await Gestures.findOne({_id: id}).populate('category').populate('author')
    
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
	const array = await Gestures.find({
		...req.query
	}).populate('category').populate('author').exec()

	res.json({
		code: 0,
		array
	})
}

const create = async (req, res) => {
    let payload = {
        name: req.body.name, 
        entity: req.body.entity, 
        key: req.body.key, 
        status: req.body.status, 
        author: req.user._id,
        date: new Date().getTime(),  
        image: req.body.image
    }
    if (req.body.category) payload.category = req.body.category
    try {
		let object = await Gestures.create(payload)
        object = await Gestures.findById(object._id).populate('author').populate('category')
		res.json({
			code: 0,
			object
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
	const object = await Gestures.deleteOne({
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

            await Gestures.updateOne({
                _id: id
            }, {
                $set: {
                    ...req.body
                }
            }).exec()
    
            const object = await Gestures.findOne({_id: id}).exec()
    
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
