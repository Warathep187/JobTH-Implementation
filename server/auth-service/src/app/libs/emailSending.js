import AWS from "aws-sdk";
import { SENDER_EMAIL } from "../config";

AWS.config.update({ region: "ap-southeast-1" });

const sendEmail = (email, subject, contentInHtml) => {
  var params = {
    Destination: {
      CcAddresses: [],
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: contentInHtml,
        },
        Text: {
          Charset: "UTF-8",
          Data: "",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: SENDER_EMAIL,
  };

  return new Promise((resolve, reject) => {
    const sendPromise = new AWS.SES({ apiVersion: "2010-12-01" }).sendEmail(params).promise();
    sendPromise.then((res) => resolve(res)).catch((e) => {
      reject(e)
    });
  });
};

export default {
  sendEmail,
};
