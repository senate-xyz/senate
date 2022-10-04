export enum PagesEnum {
  None = 1,
  Dashboard,
  Watchlist,
  Tracker,
  Settings,
}

export interface LinkItemSPAProps {
  name: string;
  id: PagesEnum;
  icon: number;
}
