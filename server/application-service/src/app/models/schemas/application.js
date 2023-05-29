import { Schema, model } from "mongoose";

const schema = new Schema({
  job: {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
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
    company: {
      _id: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      companyName: {
        type: String,
        required: true,
      },
      image: {
        url: {
          type: String,
          default: "/unknown-profile.jpeg",
        },
      },
    },
    createdAt: {
      type: Date,
      required: true
    }
  },
  contact: {
    email: {
      type: String,
      required: true,
    },
    tel: {
      type: String,
      required: true,
    },
  },
  resume: {
    key: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ["WAITING", "RECEIVED"],
    default: "WAITING",
  },
  jobSeekerId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const ApplicationModel = model("Application", schema);

export default ApplicationModel;
