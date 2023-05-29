import { Schema, model } from "mongoose";

const schema = new Schema({
  firstName: {
    type: String,
    default: ""
  },
  lastName: {
    type: String,
    default: ""
  },
  birthday: {
    type: Date,
    default: null
  },
  gender: {
    type: String,
    enum: ["MALE", "FEMALE", "NONE"],
    default: "NONE"
  },
  address: {
    type: String,
    default: ""
  },
  profileImage: {
    key: {
      type: String,
      default: null
    },
    url: {
      type: String,
      default: "/unknown-profile.jpeg"
    }
  },
  settings: {
    canViewEducation: {
      type: Boolean,
      default: true
    }
  },
  interestedTags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag"
    }
  ],
  interestedPositions: [{
    type: String
  }],
  educations: {
    type: Array,
  }
}, {
  versionKey: false,
  timestamps: false
});

const JobSeekerModel = model("JobSeeker", schema);

export default JobSeekerModel;