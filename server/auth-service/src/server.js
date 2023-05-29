import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { MESSAGE_BROKER_URL, MONGODB_URL, PORT } from "./app/config";
import authRouter from "./app/routes";
import validateApiGateWayHeaders from "./app/libs/validateApiGatewayHeaders";
import { connectRabbitMQ } from "./app/models/messageQueueModel";

const app = express();

mongoose
  .connect(MONGODB_URL, {
    connectTimeoutMS: 3000,
    socketTimeoutMS: 3000,
  })
  .then(() => console.log("MongoDB is connected"))
  .catch((e) => {
    throw new Error(e);
  });

connectRabbitMQ(MESSAGE_BROKER_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/auth", validateApiGateWayHeaders, authRouter);

app.get("/healthz", (req, res) => {
  res.send({
    ok: true,
  });
});

app.listen(PORT, () => console.log(`Auth service is running on port ${PORT}🚀`));
