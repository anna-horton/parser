const { Types } = require("mongoose");
const { Categories } = require("../schemes");

const get = async (req, res) => {
  if (req.params.id) {
    const id = new Types.ObjectId(req.params.id);
    const object = await Categories.findOne({ _id: id });

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
  const array = await Categories.find({
    ...req.query,
  })
    .populate("parent")
    .exec();

  res.json({
    code: 0,
    array,
  });
};

const create = async (req, res) => {
  const payload = { name: req.body.name };

  if (req.body.parent) payload.parent = req.body.parent;
  try {
    const object = await Categories.create(payload);

    if (object.parent)
      object.parent = await Categories.findById(object.parent).exec();

    res.json({
      code: 0,
      object,
    });
  } catch (err) {
    res.json({
      code: 400,
      message: "Ошибка при создании",
    });
  }
};

const remove = async (req, res) => {
  const id = new Types.ObjectId(req.params.id);
  const object = await Categories.deleteOne({
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

      await Categories.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            ...req.body,
          },
        }
      ).exec();

      const object = await Categories.findOne({ _id: id })
        .populate("parent")
        .exec();

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
