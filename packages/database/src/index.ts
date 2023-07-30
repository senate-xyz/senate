import { type Prisma, PrismaClient } from "@prisma/client";

export type { JsonArray, JsonValue } from "type-fest";

export {
  type PrismaClient,
  type proposal as Proposal,
  type voter as Voter,
  type voterhandler as VoterHandler,
  type vote as Vote,
  type subscription as Subscription,
  type dao as DAO,
  type user as User,
  NotificationType,
  DAOHandlerType,
  ProposalState,
  MagicUserState,
  type daohandler as DAOHandler,
} from "@prisma/client";

export type Decoder = {
  address?: string;
  proposalUrl?: string;
  space?: string;

  //makerpools
  address_vote?: string;
  address_create?: string;
};

export type RefreshArgs = {
  voters: string[];
};

export type ProposalType = Prisma.proposalGetPayload<{
  include: { votes: true; dao: true };
}>;

export type SubscriptionType = Prisma.subscriptionGetPayload<{
  include: { dao: true };
}>;

export type DAOHandlerWithDAO = Prisma.daohandlerGetPayload<{
  include: { dao: true };
}>;

export type DAOType = Prisma.daoGetPayload<{
  include: {
    handlers: true;
    subscriptions: true;
  };
}>;

export type UserWithSubscriptionsAndVotingAddresses = Prisma.userGetPayload<{
  include: {
    subscriptions: true;
    voters: true;
  };
}>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import * as schema from "./db/schema";

const connection = connect({
  url: process.env.DATABASE_URL,
});

export const db = drizzle(connection, { schema: { ...schema } });

export {
  like,
  eq,
  and,
  not,
  sql,
  isNull,
  isNotNull,
  inArray,
  asc,
  desc,
  exists,
  notExists,
} from "drizzle-orm";
export const {
  dao,
  daohandler,
  proposal,
  subscription,
  user,
  vote,
  voter,
  voterhandler,
  userTovoter,
  notification,
} = schema;
