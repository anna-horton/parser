const express = require("express"),
  app = express(),
  appRouter = require("./router"),
  mongoose = require("mongoose");

require("dotenv").config();
require("./schemes");

const host = process.env.HOST;
const port = process.env.PORT;

mongoose.connect(
  process.env.MONGO_HOST,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    if (err) return console.log(err);
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/", appRouter);

app.listen(port, host, function () {
  console.log(`Server listens http://${host}:${port}`);
});
