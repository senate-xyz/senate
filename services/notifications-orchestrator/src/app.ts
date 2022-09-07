import express from "express";
import { SubscriptionType } from "../../../types/index";
let integrationTestType: SubscriptionType;

const app = express();
const port = 3002;

app.listen(port, () => {
  console.log(`Notifications orchestrator service running on ${port}.`);
});
