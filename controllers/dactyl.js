const { Types } = require("mongoose");
const { Dactyl } = require("../schemes");

const get = async (req, res) => {
  if (req.params.id) {
    const id = new Types.ObjectId(req.params.id);
    const object = await Dactyl.findOne({ _id: id });

    res.json({
      code: 0,
      object,
    });
  } else {
    res.json({
      code: 404,
    });
  }
};

const list = async (req, res) => {
  if (req.query.name) req.query.name = { $regex: req.query.name };
  const array = await Dactyl.find({
    ...req.query,
  }).exec();

  res.json({
    code: 0,
    array,
  });
};

const create = async (req, res) => {
  const { name, key, lang, image } = req.body;

  try {
    const object = await Dactyl.create({
      key,
      image,
      lang,
      name,
    });

    res.json({
      code: 0,
      object,
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: 400,
      message: "Ошибка при создании",
    });
  }
};

const remove = async (req, res) => {
  const id = new Types.ObjectId(req.params.id);
  const object = await Dactyl.deleteOne({
    _id: id,
  });

  res.json({
    code: 0,
    object,
  });
};

const update = async (req, res) => {
  try {
    if (req.params.id) {
      const id = new Types.ObjectId(req.params.id);

      await Dactyl.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            ...req.body,
          },
        }
      ).exec();

      const object = await Dactyl.findOne({ _id: id }).exec();

      res.json({
        code: 0,
        object,
      });
    } else
      res.json({
        code: 404,
      });
  } catch (err) {
    res.json({
      code: 400,
      message: "Ошибка при обновлении",
    });
  }
};

module.exports = { get, list, create, remove, update };
