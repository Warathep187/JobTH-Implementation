import { Schema, model } from "mongoose";

const schema = new Schema({
  companyName: {
    type: String,
    required: true,
  },
  image: {
    key: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: "/unknown-profile.jpeg"
    }
  },
  contact: {
    email: {
      type: String,
      required: true
    },
    tel: {
      type: String,
      required: true,
    }
  },
  information: {
    type: String,
    default: ""
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag"
    }
  ]
}, {
  versionKey: false,
  timestamps: false
})

const CompanyModel = model("Company", schema);

export default CompanyModel;