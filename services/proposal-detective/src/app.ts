import express from "express";
import { ProposalType } from "./../../../types/index";
let integrationTestType: ProposalType;

const app = express();
const port = 3001;

app.listen(port, () => {
  console.log(`Proposal detective service running on ${port}.`);
});
