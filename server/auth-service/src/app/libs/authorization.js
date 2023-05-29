import ROLE from "../../constants/role";

const verifyCompany = (req, res, next) => {
  try {
    const { userid, role } = req.headers;
    if (role !== ROLE.COMPANY) {
      return res.status(403).send({
        msg: "Access denied",
      });
    }
    req.user = {
      userId: userid,
      role,
    };
    next();
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const verifyJobSeeker = (req, res, next) => {
  try {
    const { userid, role } = req.headers;

    if (role !== ROLE.JOB_SEEKER) {
      return res.status(403).send({
        msg: "Access denied",
      });
    }
    req.user = {
      userId: userid,
      role,
    };
    next();
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

const verifyAllRole = (req, res, next) => {
  try {
    const { userid, role } = req.headers;
    req.user = {
      userId: userid,
      role,
    };
    next();
  } catch (e) {
    res.status(500).send({
      msg: "Something went wrong",
    });
  }
};

export default {
  verifyCompany,
  verifyJobSeeker,
  verifyAllRole,
};
