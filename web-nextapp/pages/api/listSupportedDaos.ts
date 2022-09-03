import type { NextApiRequest, NextApiResponse } from "next";
import { DaoType } from "../../types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const DaoItems: Array<DaoType> = [
    {
      id: 1,
      name: "SomeDao",
      image:
        "https://www.rd.com/wp-content/uploads/2021/04/GettyImages-1070620072-scaled.jpg",
      url: "google.com",
      governance_contract: "0xdeaddeaddead",
    },
    {
      id: 2,
      name: "SomeDao",
      image:
        "https://www.rd.com/wp-content/uploads/2021/04/GettyImages-1070620072-scaled.jpg",
      url: "google.com",
      governance_contract: "0xdeaddeaddead",
    },
    {
      id: 3,
      name: "SomeDao",
      image:
        "https://www.rd.com/wp-content/uploads/2021/04/GettyImages-1070620072-scaled.jpg",
      url: "google.com",
      governance_contract: "0xdeaddeaddead",
    },
    {
      id: 4,
      name: "SomeDao",
      image:
        "https://www.rd.com/wp-content/uploads/2021/04/GettyImages-1070620072-scaled.jpg",
      url: "google.com",
      governance_contract: "0xdeaddeaddead",
    },
  ];
  res.status(200).json(DaoItems);
}
