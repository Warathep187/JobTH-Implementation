import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    position: {
      type: String,
      required: true,
    },
    details: [
      {
        type: String,
        required: true,
      },
    ],
    qualifications: [
      {
        type: String,
        required: true,
      },
    ],
    benefits: [
      {
        type: String,
        required: true,
      },
    ],
    salary: {
      min: {
        type: Number,
        required: true,
        min: 0,
      },
      max: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    location: {
      district: {
        type: String,
        required: true,
      },
      province: {
        type: String,
        required: true,
      },
    },
    companyId: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    createdAt: {
      type: Date,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

const JobModel = model("Job", schema);

export default JobModel;
