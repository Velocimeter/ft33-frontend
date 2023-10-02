export interface Weather {
  address: string;
  twitterName: string;
  twitterUsername: string;
  twitterPfpUrl: string;
  frens: Frens;
  points: Points;
  portfolio: Portfolio;
  key: Key;
}
export interface Frens {
  count: number;
  score: number;
}
export interface Points {
  totalPoints: number;
  tier: string;
}
export interface Portfolio {
  count: number;
  value: number;
  liquidation: number;
  paid: number;
  pnl: number;
  performer: Performer;
}
export interface Performer {
  best: BestOrWorst;
  worst: BestOrWorst;
}
export interface BestOrWorst {
  address: string;
  twitterName: string;
  twitterPfpUrl: string;
  paid: number;
  sold: number;
  currentValue: number;
  keys: number;
}
export interface Key {
  value: number;
  buy: number;
  sell: number;
  mcap: number;
  fees: number;
  holders: Holders;
}
export interface Holders {
  count: number;
  supply: number;
}
