import { Schema, model } from "mongoose";

const schema = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  security: {
    tempId: {
      type: String,
      default: null
    }
  },
  verifiedAt: {
    type: Date,
    default: null
  }
}, {
  versionKey: false,
  timestamps: false
});

const JobSeekerModel = model("JobSeeker", schema);

export default JobSeekerModel;