import multer from "multer";
import express from "express";
import imageCtrl from "../controllers/recipe.image.controller.js";
import authCtrl from "../controllers/auth.controller.js";
import fs from "file-system";

const storageBookImage = multer.diskStorage({
  destination: (req, file, callback) => {
    //if folder doesn't exist, create one
    if (!fs.fs.existsSync("./images/")) {
      fs.fs.mkdirSync("./images/", { recursive: true });
    }

    callback(null, "./images/");
  },
  filename: (req, file, callback) => {
    callback(null, `${file.originalname}`);
  },
});

const uploadBookImage = multer({
  storage: storageBookImage,
});

const router = express.Router();

router
  .route("/uploadImage")
  .post(
    authCtrl.hasAuthorization,
    uploadBookImage.single("test"),
    imageCtrl.create
  )
  .delete(authCtrl.hasAuthorization, imageCtrl.removeFiles);

export default router;
