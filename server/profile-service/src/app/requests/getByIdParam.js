const { param } = require("express-validator");

const validateFieldsList = [
  param("id").matches(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i).withMessage("ไม่พบบริษัท")
]

export default validateFieldsList;