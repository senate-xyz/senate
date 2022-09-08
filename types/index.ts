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
        createdTime: true;
        delay: true;
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

export type NotificationSettings = Prisma.NotificationSettingsGetPayload<{
  select: {
    createdTime: true;
    delay: true;
  };
}>;

export enum NotificationChannel {
  None = 0,
  Discord,
  Slack,
}

export enum NotificationInterval {
  None = 0,
  NewProposal = -1,
  OneHour = 3600,
  TwoHours = 3600 * 2,
  ThreeHours = 3600 * 3,
  SixHours = 3600 * 6,
  TwelveHours = 3600 * 12,
  OneDay = 86400,
  TwoDays = 86400 * 2,
  ThreeDays = 86400 * 3,
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
