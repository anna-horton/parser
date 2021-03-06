const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Admin = mongoose.model("Admin", {
  email: String,
  password: String,
  name: String,
});

const Users = mongoose.model("Users", {
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  name: String,
});

const Gestures = mongoose.model("Gestures", {
  image: String,
  entity: String,
  key: String,
  name: String,
  status: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  date: Date,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
});

const Categories = mongoose.model("Category", {
  name: String,
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

const Dactyl = mongoose.model("Dactyl", {
  name: String,
  image: String,
  lang: String,
  key: String,
});

module.exports = {
  Admin,
  Users,
  Categories,
  Dactyl,
  Gestures,
};

const checkAdmin = async () => {
  try {
    const admin = await Admin.findOne({
      email: process.env.ADMIN_EMAIL,
    });
    if (!admin) {
      let password = await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        Number(process.env.SALT)
      );
      let r = await Admin.updateOne(
        {
          email: process.env.ADMIN_EMAIL,
        },
        {
          $set: {
            email: process.env.ADMIN_EMAIL,
            name: process.env.ADMIN_NAME,
            password,
          },
        },
        {
          upsert: true,
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
};

checkAdmin();
