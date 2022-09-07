import express from "express";
import { SubscriptionType } from "./../../../types/index";
let integrationTestType: SubscriptionType;

const app = express();
const port = 3010;

app.listen(port, () => {
  console.log(`Discord bot service running on ${port}.`);
});
