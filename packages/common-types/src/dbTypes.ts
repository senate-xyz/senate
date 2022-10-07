import { Prisma } from "@prisma/client";
import { ProposalType as ProposalTypePrisma } from "@prisma/client";

export type ProposalType = ProposalTypePrisma;

export type DAOType = Prisma.DAOGetPayload<{
  include: {
    handlers: true;
    subscriptions: true;
  };
}>;
