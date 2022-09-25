import express from "express";
import { ProposalType, TypedRequestBody } from "./../../../types/index";
import { ethers } from "ethers"
import * as EpnsAPI from "@epnsproject/sdk-restapi";
import  dotenv from "dotenv";

dotenv.config();
let integrationTestType: ProposalType;

const app = express();
const port = 3004;

const signer = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`);

app.use(express.json())

app.listen(port, () => {
  console.log(`EPNS service running on ${port}.`);
});

type sendNotificationBody = {
  recipients: string[];
  daoName: string;
  msg: string;
  proposalUrl: string;
}

function isBodyType(body: any): body is sendNotificationBody {
  return (body as sendNotificationBody).recipients !== undefined 
    && (body as sendNotificationBody).daoName !== undefined
    && (body as sendNotificationBody).msg !== undefined
    && (body as sendNotificationBody).proposalUrl !== undefined;
}

app.post("/api/sendNotification", async (req: TypedRequestBody<sendNotificationBody>, res: express.Response) => {
  console.log("Sending notification to addresses", req.body);
  
  if (isBodyType(req.body) === false) {
    console.log("Invalid body format")
    res.status(400).send({
      "msg": "Invalid body format"
    })
    return;
  }

  let recipients = req.body.recipients.map(address => `eip155:42:${address}`);

  // apiResponse?.status === 204, if sent successfully!
  const apiResponse = await EpnsAPI.payloads.sendNotification({
    signer,
    type: 4, // subset
    identityType: 2, // direct payload
    notification: {
      title: req.body.daoName,
      body: req.body.msg
    },
    payload: {
      title: req.body.daoName,
      body: req.body.msg,
      cta: req.body.proposalUrl,
      img: ''
    },
    recipients: recipients, // recipients addresses
    channel: 'eip155:42:0x0E1774FD4f836E6Ba2E22d0e11F4c69684ae4EB7', // your channel address
    env: 'staging'
  });

  res.sendStatus(apiResponse?.status);
})
