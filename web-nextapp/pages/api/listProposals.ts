import type { NextApiRequest, NextApiResponse } from "next";
import { ProposalType } from "../../types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const DaoItems: Array<ProposalType> = [
    {
      id: 1,
      name: "A proposal",
      timeLeft: "1 day",
      voted: true,
    },
    {
      id: 2,
      name: "Another proposal",
      timeLeft: "1 minute",
      voted: false,
    },
    {
      id: 3,
      name: "Merge?",
      timeLeft: "1 month",
      voted: true,
    },
  ];
  res.status(200).json(DaoItems);
}
