import express from "express";
import { ProposalType } from "./../../../types/index";
let integrationTestType: ProposalType;

const app = express();
const port = 3011;

app.listen(port, () => {
  console.log(`Slack bot service running on ${port}.`);
});
