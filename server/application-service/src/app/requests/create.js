import { body, check } from "express-validator";

const validateFieldsList = [
  body("resume")
    .matches(/^data:image\/(?:png|jpeg|bmp|webp|svg\+xml)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/)
    .withMessage("ไฟล์Resumeไม่ถูกต้อง"),
  body("jobId")
    .matches(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
    .withMessage("งานที่ต้องการสมัครไม่ถูกต้อง"),
  check("contact.email").isEmail().withMessage("อีเมลติดต่อไม่ถูกต้อง"),
  check("contact.tel")
    .matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    .withMessage("เบอร์โทรติดต่อไปถูกต้อง"),
];

export default validateFieldsList;
