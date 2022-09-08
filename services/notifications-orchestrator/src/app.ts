import express from "express";
import { ProposalType } from "./../../../types/index";
let integrationTestType: ProposalType;

const app = express();
const port = 3002;

app.listen(port, () => {
  console.log(`Notifications orchestrator service running on ${port}.`);
});
