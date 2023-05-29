import jobSeekerModel from "../models/jobSeeker";
import companyModel from "../models/company";
import { ack, nack } from "../models/messageQueueModel";
import { MessageTypes } from "../../constants/queuesAndExchanges";

const rollbackJobSeekerAccount = async (msg, data) => {
  try {
    await jobSeekerModel.deleteOne({ _id: data._id });
    console.log("JOB SEEKER DELETED", data);
    ack(msg);
  } catch (e) {
    nack(msg);
  }
};

const rollbackCompanyAccount = async (msg, data) => {
  try {
    await companyModel.deleteOne({ _id: data._id });
    console.log("COMPANY DELETED", data);
    ack(msg);
  } catch (e) {
    nack(msg);
  }
};

const rollback = async (msg) => {
  const msgContent = msg.content.toString();
  const data = JSON.parse(msgContent);
  if (data.type === MessageTypes.JOB_SEEKER_ROLLED_BACK) {
    await rollbackJobSeekerAccount(msg, data);
  } else if (data.type === MessageTypes.COMPANY_ROLLED_BACK) {
    await rollbackCompanyAccount(msg, data);
  }
};

export default {
  rollback,
};
