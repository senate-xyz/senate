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
