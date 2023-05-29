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
  companyName: {
    type: String,
    required: true,
  },
  contact: {
    email: {
      type: String,
      default: ""
    },
    tel: {
      type: String,
      default: ""
    }
  },
  verifiedAt: {
    type: Date,
    default: null
  }
}, {
  versionKey: false,
  timestamps: false
})

const CompanyModel = model("Company", schema);

export default CompanyModel;