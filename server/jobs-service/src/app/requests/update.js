import { body, param, check } from "express-validator";

const validateFieldsList = [
  param("id")
    .matches(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
    .withMessage("ไม่พบการรับสมัครงาน"),
  body("position").notEmpty().withMessage("โปรดกรอกขื่อตำแหน่งงาน"),
  body("details").isArray({ min: 0, max: 10 }).withMessage("รายละเอียดไม่ถูกต้อง"),
  body("qualifications").isArray({ min: 0, max: 10 }).withMessage("รายละเอียดไม่ถูกต้อง"),
  body("benefits").isArray({ min: 0, max: 10 }).withMessage("รายละเอียดไม่ถูกต้อง"),
  check("salary.min").isInt({ min: 0 }).withMessage("ค่าตอบแทนไม่ถูกต้อง"),
  check("salary.max").isInt({ min: 0 }).withMessage("ค่าตอบแทนไม่ถูกต้อง"),
  check("location.district").notEmpty().withMessage("โปรดเลือกอำเภอ"),
  check("location.province").notEmpty().withMessage("โปรดเลือกจังหวัด"),
  check("tags")
    .matches(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
    .withMessage("Tagไม่ถูกต้อง"),
];

export default validateFieldsList;
