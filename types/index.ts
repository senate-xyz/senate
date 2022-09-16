import { Prisma } from "@prisma/client";

export type DaoType = Prisma.DaoGetPayload<{}>;

export type ProposalType = Prisma.ProposalGetPayload<{
  include: {
    dao: true;
    userVote: true;
  };
}>;

export enum ProposalTypeEnum {
  Snapshot = 0,
  Chain,
}

export type NotificationSettingType = Prisma.NotificationSettingGetPayload<{
  select: {
    createdTime: true;
    delay: true;
  };
}>;

export type NotificationChannelType = Prisma.NotificationChannelGetPayload<{
  select: {
    type: true;
    connector: true;
  };
}>;

export enum NotificationChannelEnum {
  None = 0,
  Discord,
  Slack,
}

export enum NotificationIntervalEnum {
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

export enum PagesEnum {
  None = 1,
  Dashboard,
  Subscriptions,
  Tracker,
  Settings,
}

export interface LinkItemSPAProps {
  name: string;
  id: PagesEnum;
  icon: number;
}

export const TEST_USER = "0xa93ae3a2ce1714f422ec2d799c48a56b2035c872";
