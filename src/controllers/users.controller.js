import User from "../models/user.model.js";
import _ from "lodash";
import errorHandler from "../controllers/helpers/dbErrorHandlers.js";
import dbErrorHandlers from "../controllers/helpers/dbErrorHandlers.js";

const create = async (req, res, next) => {
  let nameToCheck = await User.findOne({ name: req.body.name });
  let emailToCheck = await User.findOne({ email: req.body.email });

  if (nameToCheck) {
    return res.send({ error: "Username is already taken!" });
  }

  if (emailToCheck) {
    return res.send({ error: "Email is already taken!" });
  }

  const user = new User(req.body);
  user.save((err, result) => {
    if (err) {
      res.send({ error: errorHandler.getErrorMessage(err) });
    } else {
      res.send({ message: "Successfuly created a new user." });
    }
  });
};

const read = (req, res) => {
  res.status(200).json(req.profile);
};

const update = async (req, res, next) => {
  let userToCheck = await User.findOne({ name: req.body.name });
  let user = req.profile;

  let password = req.profile.hashed_password;
  let salt = req.profile.salt;

  user = _.extend(user, req.body);

  if (userToCheck) {
    if (userToCheck._id.toString() !== req.profile._id.toString()) {
      return res.send({ error: "Username not available" });
    }
  }

  // chnage password only if user submits new password, otherwise keep the old one
  if (req.body.newPassword.length > 0) {
    let userProfile = await User.findOne({ _id: req.profile._id });
    if (!userProfile.authenticate(req.body.password)) {
      return res.send({ error: "Incorrect old password" });
    } else {
      user.hashed_password = null;
      user.password = req.body.newPassword;
    }
  } else {
    user.hashed_password = password;
    user.salt = salt;
  }

  user.updated = Date.now();
  user.save((err) => {
    if (err) {
      return res.send({ error: dbErrorHandlers.getErrorMessage(err) });
    } else {
      return res.send({
        message: "Data updated",
        data: user,
      });
    }
  });
};

const remove = (req, res, next) => {
  let user = req.profile;
  user.remove((err) => {
    if (err) {
      return res.status(400).send({ error: errorHandler.getErrorMessage(err) });
    }
    res.status(200).send({ message: "Account closed" });
  });
};

const userByID = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.json({ error: "User not found!" });
    }
    req.profile = user;
    next();
  });
};

export default {
  create,
  read,
  update,
  remove,
  userByID,
};
