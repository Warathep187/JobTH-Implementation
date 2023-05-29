import express from "express";
import bodyParser from "body-parser";
import { PORT } from "./app/config";
import jobsSearchingRouter from "./app/routes";
import esModel from "./app/models/elasticsearch";

const app = express();

esModel.checkESClusterHealth();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/search", jobsSearchingRouter);

app.get("/healthz", (req, res) => {
  res.send({
    ok: true,
  });
});

app.listen(PORT, () => console.log(`Jobs-searching service is running on port ${PORT}🚀`));
