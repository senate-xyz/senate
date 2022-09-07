import { Prisma } from "@prisma/client";

export type SubscriptionType = Prisma.SubscriptionGetPayload<{
  include: {
    Dao: true;
    notificationChannels: {
      select: {
        type: true;
        connector: true;
      };
    };
    notificationSettings: {
      select: {
        time: true;
      };
    };
  };
}>;

export type UnsubscribedType = Prisma.DaoGetPayload<{}>;

export type ProposalType = Prisma.ProposalGetPayload<{
  include: {
    dao: true;
  };
}>;

export enum NotificationChannelTypes {
  None = 0,
  Discord,
  Slack,
}

export enum Pages {
  None = 1,
  Dashboard,
  Subscriptions,
  Settings,
}

export interface LinkItemSPAProps {
  name: string;
  id: Pages;
  icon: number;
}
