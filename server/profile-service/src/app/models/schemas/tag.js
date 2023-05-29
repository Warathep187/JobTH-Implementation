import { Schema } from "mongoose";

const tagSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

export default tagSchema;
