import { Prisma } from "@prisma/client";
import {
  ProposalType as ProposalTypePrisma,
  DAOHandlerType as DAOHandlerTypePrisma,
} from "@prisma/client";

export type ProposalType = ProposalTypePrisma;
export type DAOHandlerType = DAOHandlerTypePrisma;

export type DAOType = Prisma.DAOGetPayload<{
  include: {
    handlers: true;
    subscriptions: true;
  };
}>;

export type TrackerProposalType = Prisma.ProposalGetPayload<{
  include: {
    dao: true;
    votes: true;
  };
}>;
