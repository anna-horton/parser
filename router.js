const jwt = require("jsonwebtoken");
const express = require("express");
const { Admin, Users } = require("./schemes");
const router = express.Router();
const bcrypt = require("bcrypt");
const gestures = require("./controllers/gestures");
const users = require("./controllers/users");
const categories = require("./controllers/categories");
const dactyl = require("./controllers/dactyl");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./spa/public/assets/imgs/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

router.post("/login", async (req, res) => {
  try {
    if (!req.body.email)
      throw {
        code: 400,
        message: "Email обязателен",
      };
    let user = await Admin.findOne({
      email: req.body.email,
    });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        let token = await jwt.sign(
          {
            ...user,
            isLogin: true,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: 60 * 60,
          }
        );
        res.json({
          code: 200,
          object: {
            ...user._doc,
            isAdmin: true,
          },
          token,
        });
      } else
        throw {
          code: 401,
          message: "Пароли не совпадают",
        };
    } else {
      user = await Users.findOne({
        email: req.body.email,
      });
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          let token = await jwt.sign(
            {
              ...user,
              isLogin: true,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: 60 * 60,
            }
          );
          res.json({
            code: 200,
            object: {
              ...user._doc,
              isAdmin: false,
            },
            token,
          });
        } else
          throw {
            code: 401,
            message: "Пароли не совпадают",
          };
      } else
        throw {
          code: 404,
          message: "Такого аккаунта не существует",
        };
    }

    console.log(req.body);
  } catch (err) {
    res.json(err).status(err.code);
  }
});

router.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.files);
  if (req.file) {
    res.json({
      code: 0,
      object: req.file,
    });
  } else {
    res.json({
      code: 400,
    });
  }
});
router.post("/users/", users.create);

router.use(async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      let comingToken = req.headers.authorization.slice(6);
      console.log(comingToken);
      const token = await jwt.verify(comingToken, process.env.JWT_SECRET);
      req.user = token._doc;
      next();
    } else
      throw {
        code: 403,
        message: "Нужна авторизация",
      };
  } catch (err) {
    console.log(err);
    res.json({
      code: 403,
      message: "Сессия истекла",
    });
  }
});

router.get("/", (req, res) => {
  var decoded = jwt.decode(token);

  if (!req.user.isLogin)
    throw {
      code: 401,
      message: "Not authorization",
    };
});

router.get("/users/:id", users.get);
router.delete("/users/:id", users.remove);
router.put("/users/:id", users.update);
router.get("/users/", users.list);

router.get("/categories/:id", categories.get);
router.delete("/categories/:id", categories.remove);
router.put("/categories/:id", categories.update);
router.post("/categories/", categories.create);
router.get("/categories/", categories.list);

router.get("/dactyl/:id", dactyl.get);
router.delete("/dactyl/:id", dactyl.remove);
router.put("/dactyl/:id", dactyl.update);
router.post("/dactyl/", dactyl.create);
router.get("/dactyl/", dactyl.list);

router.get("/gestures/:id", gestures.get);
router.delete("/gestures/:id", gestures.remove);
router.put("/gestures/:id", gestures.update);
router.post("/gestures/", gestures.create);
router.get("/gestures/", gestures.list);

module.exports = router;
