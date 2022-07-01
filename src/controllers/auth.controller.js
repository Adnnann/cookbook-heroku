import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import User from "../models/user.model.js";
import config from "../config/config.js";
const signin = (req, res) => {
  User.findOne({ name: req.body.name }, (err, user) => {
    if (err || !user) {
      return res.send({ error: "User not found" });
    }

    if (!user.authenticate(req.body.password)) {
      return res.send({ error: "Username and password do not match" });
    }

    const token = jwt.sign(
      { _id: user._id, name: user.name, email: user.email },
      config.secret
    );

    res.cookie("userJwtToken", token, {
      expire: new Date() + 999,
      httpOnly: true,
    });

    res.send({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  });
};

const signout = (req, res) => {
  res.clearCookie("userJwtToken");
  res.send({
    message: "User signed out",
  });
};

const requireSignin = expressJwt({
  secret: config.secret,
  algorithms: ["HS256"],
  userProperty: "auth",
});

const hasAuthorization = (req, res, next) => {
  if (!req.cookies.userJwtToken) {
    return res.send({ error: "User not signed" });
  }

  next();
};

export default { signin, signout, hasAuthorization, requireSignin };
