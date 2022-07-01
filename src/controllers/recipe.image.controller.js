import _ from "lodash";
import fs from "file-system";
import fsExtra from "fs-extra";
import Image from "../models/image.model.js";

const create = (req, res, next) => {
  const originalFileName = req.file.originalname.split("-")[0];

  const fileName = req.file.originalname;

  console.log(originalFileName);
  //file size treshold
  const fileSizeLimit = 1024 * 1024 * 10;
  //if no file sent to server report error. This is handled on frontend
  //but wanted to have additional check
  if (!req.file) {
    return res.send({ error: "You forgot to upload file" });
  }

  const image = new Image({
    image: req.file.originalname,
    imageUrl: `http://localhost:5000/images/${req.file.originalname}`,
  });
  //if file size bigger than treshold remove file
  if (req.file.size > fileSizeLimit) {
    fs.fs.unlinkSync(`./${req.file.path}`);
    return res.send({ Error: "Allowed size of image is 10MB" });
  } else {
    if (
      req.file.mimetype.includes("image/jpeg") ||
      req.file.mimetype.includes("image/png")
    ) {
      image.save((err, result) => {
        if (err) {
          return res.send({ error: errorHandler.getErrorMessage(err) });
        } else {
          //loop through folder images and filter all images that have the same value before
          // -. Than remove all except last added item
          fs.fs
            .readdirSync("./images")
            .filter((item) => item.includes(`${originalFileName}`))
            .map((item) => {
              if (item !== fileName) {
                fs.fs.unlinkSync(`./images/${item}`);
              }
            });

          res.send({
            message: "Cover image uploaded successfuly",
            imageUrl: `/images/${fileName}`,
          });
        }
      });
    } else {
      //Multer is not preventing user to upload message but reports only error.
      //Code below unlinkes file if there is any error (for example wrong file format)
      fs.fs.unlinkSync(`./${req.file.path}`);
      return res.send({ Error: "Format of the file must be PNG | JPEG | JPG" });
    }
  }
};

const removeFiles = (req, res) => {
  let dir = "./output";
  try {
    fsExtra.emptyDirSync(dir);
    res.send({ message: "Output folder cleaned" });
  } catch (err) {
    res.send({ error: "Error while trying to clean folder" });
  }
};

export default {
  create,
  removeFiles,
};
