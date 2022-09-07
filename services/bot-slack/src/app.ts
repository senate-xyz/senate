import express from "express";
import { SubscriptionType } from "../../../types/index";
let integrationTestType: SubscriptionType;

const app = express();
const port = 3011;

app.listen(port, () => {
  console.log(`Slack bot service running on ${port}.`);
});
