import { Prisma } from "@prisma/client";
import { ProposalType as ProposalTypePrisma } from "@prisma/client";

export type Proposal = Prisma.ProposalGetPayload<{
  include: {
    dao: true;
    votes: true;
  };
}>;

export type ProposalType = ProposalTypePrisma;

export type DAOType = Prisma.DAOGetPayload<{
  include: {
    handlers: true;
    subscriptions: true;
  };
}>;
