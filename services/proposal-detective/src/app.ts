import express from "express";
import { SubscriptionType } from "../../../types/index";
let integrationTestType: SubscriptionType;

const app = express();
const port = 3001;

app.listen(port, () => {
  console.log(`Proposal detective service running on ${port}.`);
});
