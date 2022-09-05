import express from "express";

const app = express();
const port = 3011;

app.listen(port, () => {
  console.log(`Slack bot service running on ${port}.`);
});
