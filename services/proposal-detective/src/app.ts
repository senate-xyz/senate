import express from "express";

const app = express();
const port = 3001;

app.listen(port, () => {
  console.log(`Proposal detective service running on ${port}.`);
});
