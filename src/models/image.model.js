import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  bookTitle: {},
});

export default mongoose.model("Image", ImageSchema);
