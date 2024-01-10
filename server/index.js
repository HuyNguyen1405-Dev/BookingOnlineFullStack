const express = require("express");

const app = express();

const cors = require("cors");

const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const User = require("./model/User");

const bcryptSalt = bcrypt.genSaltSync(10);

const jwt = require("jsonwebtoken");

const jwtSecret = "fasefraw4r5r3wq45wdfgw34twdfg";

const cookieParser = require("cookie-parser");

require("dotenv").config();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: "http://127.0.0.1:5173",
  })
);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Đã kết nối với MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Lỗi kết nối MongoDB Atlas:", error);
  });

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(422).json({ error: "Email already exists" });
  } else {
    try {
      const userDoc = await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcryptSalt),
      });
      res.json(userDoc);
    } catch (err) {
      res.status(422).json(err);
    }
  }
});

const cookieOptions = {
  httpOnly: true,
  sameSite: "None",
};

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const checkPass = bcrypt.compareSync(password, existingUser.password);
    if (checkPass) {
      jwt.sign(
        {
          email: existingUser.email,
          id: existingUser._id,
          name: existingUser.name,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json({ user: existingUser });
        }
      );
    } else {
      return res.status(422).json({
        error: "The password do not correct, Please try again",
      });
    }
  } else {
    return res.status(422).json({
      error: "Could not find username or email in system, Please try again!",
    });
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});
app.listen(4000);
