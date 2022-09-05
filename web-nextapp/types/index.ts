import { IconType } from "react-icons/lib";

export interface SubscriptionType {
  id: number;
  name: string;
  image: string;
  url: string;
  governanceContract: string;
  notificationSettings: NotificationSettings;
}

export interface NotificationSettings {
  discord: boolean;
  slack: boolean;
  notificationOptions: Array<notificationOptions>;
}

export interface notificationOptions {
  type: NotificationTypes;
}

export enum NotificationTypes {
  New = 1,
  threeDays,
  twoDays,
  oneDay,
  twelveHours,
  sixHours,
  threeHours,
  oneHour,
}

export interface ProposalType {
  id: number;
  name: string;
  timeLeft: string;
  voted: boolean;
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
  icon: IconType;
}
