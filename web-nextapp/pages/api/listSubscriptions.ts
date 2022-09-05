import type { NextApiRequest, NextApiResponse } from "next";
import { NotificationTypes, SubscriptionType } from "../../types";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const DaoItems: Array<SubscriptionType> = [
    {
      id: 1,
      name: "SomeDao",
      image:
        "https://www.rd.com/wp-content/uploads/2021/04/GettyImages-1070620072-scaled.jpg",
      url: "google.com",
      governanceContract: "0xdeaddeaddead",
      notificationSettings: {
        discord: true,
        slack: false,
        notificationOptions: [
          { type: NotificationTypes.New },
          { type: NotificationTypes.sixHours },
        ],
      },
    },
    {
      id: 2,
      name: "SomeDao",
      image:
        "https://www.rd.com/wp-content/uploads/2021/04/GettyImages-1070620072-scaled.jpg",
      url: "google.com",
      governanceContract: "0xdeaddeaddead",
      notificationSettings: {
        discord: true,
        slack: true,
        notificationOptions: [{ type: NotificationTypes.twoDays }],
      },
    },
    {
      id: 1,
      name: "SomeDao",
      image:
        "https://www.rd.com/wp-content/uploads/2021/04/GettyImages-1070620072-scaled.jpg",
      url: "google.com",
      governanceContract: "0xdeaddeaddead",
      notificationSettings: {
        discord: false,
        slack: false,
        notificationOptions: [],
      },
    },
  ];
  res.status(200).json(DaoItems);
}
