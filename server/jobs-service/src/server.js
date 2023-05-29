import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { MONGODB_URL, PORT } from "./app/config";
import jobsRouter from "./app/routes";

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/jobs", jobsRouter);

app.get("/healthz", (req, res) => {
  res.send({
    ok: true,
  });
});

app.listen(PORT, () => console.log(`Jobs service is running on port ${PORT}🚀`));
