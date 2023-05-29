import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    jobSeekerId: {
      type: String,
      required: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job"
    }
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

const FavoriteJob = model("FavoriteJob", schema);

export default FavoriteJob;
