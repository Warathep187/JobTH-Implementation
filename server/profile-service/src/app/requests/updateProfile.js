const { body, check } = require("express-validator");

const jobSeekerUpdateProfileValidateFieldsList = [
  body("firstName").notEmpty().withMessage("โปรดกรอกชื่อของคุณ"),
  body("lastName").notEmpty().withMessage("โปรดกรอกนามสกุลของคุณ"),
  body("gender").isIn(["MALE", "FEMALE", "NONE"]).withMessage("เพศไม่ถูกต้อง"),
  body("birthday").isString().withMessage("วันเกิดไม่ถูกต้อง"),
  body("address").isLength({ max: 128 }).withMessage("ที่อยู่มีความยาวมากเกินไป"),
  check("interestedTags")
    .matches(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
    .withMessage("Tagไม่ถูกต้อง"),
];

const updateProfileImageValidateFieldsList = [
  body("image")
    .matches(/^data:image\/(?:png|jpeg|bmp|webp|svg\+xml)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/)
    .withMessage("รูปภาพไม่ถูกต้อง"),
];

const jobSeekerUpdateEducationValidateFieldsList = [
  check("body").isLength({ min: 3, max: 3 }),
  check("body.level").isIn("FIRST", "SECOND", "THIRD", null).withMessage("ระดับการศึกษาไม่ถูกต้อง"),
];

const jobSeekerUpdateSettingValidateFieldsList = [
  body("canViewEducation").isBoolean().withMessage("การตั้งค่าผิดพลาด"),
];

const companyUpdateProfileValidateFieldsList = [
  body("companyName").notEmpty().withMessage("โปรดกรอกชื่อบริษัท"),
  body("information").isLength({ max: 4096 }).withMessage("รายละเอียดยาวเกินไป"),
  check("tags")
    .matches(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
    .withMessage("Tagไม่ถูกต้อง"),
  check("contact.email").isEmail().withMessage("อีเมลติดต่อไม่ถูกต้อง"),
  check("contact.tel")
    .matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    .withMessage("เบอร์โทรติดต่อไปถูกต้อง"),
];

export default {
  jobSeekerUpdateProfileValidateFieldsList,
  updateProfileImageValidateFieldsList,
  jobSeekerUpdateEducationValidateFieldsList,
  jobSeekerUpdateSettingValidateFieldsList,
  companyUpdateProfileValidateFieldsList,
};
