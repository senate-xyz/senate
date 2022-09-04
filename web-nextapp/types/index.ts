import { IconType } from "react-icons/lib";

export interface DaoType {
  id: number;
  name: string;
  image: string;
  url: string;
  governance_contract: string;
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
