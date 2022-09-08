import express from "express";
import { ProposalType } from "./../../../types/index";
let integrationTestType: ProposalType;

const app = express();
const port = 3010;

app.listen(port, () => {
  console.log(`Discord bot service running on ${port}.`);
});
