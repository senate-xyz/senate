"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import {
  db,
  eq,
  notification,
  proposal,
  sql,
  user,
  asc,
  dao,
  and,
} from "@senate/database";
import cuid from "cuid";

export const deleteUser = async () => {
  "use server";
  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";

  await db.delete(user).where(eq(user.address, userAddress));
};

export const randomQA = async () => {
  "use server";
  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";

  const [u] = await db.select().from(user).where(eq(user.address, userAddress));

  const [randomProposal] = await db
    .select()
    .from(proposal)
    .orderBy(sql`RAND()`)
    .limit(1);

  await db.insert(notification).values({
    id: cuid(),
    userid: u.id,
    proposalid: randomProposal.id,
    type: "QUORUM_NOT_REACHED_EMAIL",
  });
};

export const lastQA = async () => {
  "use server";
  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";

  const [u] = await db.select().from(user).where(eq(user.address, userAddress));

  const [firstProposal] = await db
    .select()
    .from(proposal)
    .where(eq(proposal.state, "ACTIVE"))
    .orderBy(asc(proposal.timeend));

  await db.insert(notification).values({
    id: cuid(),
    userid: u.id,
    proposalid: firstProposal.id,
    type: "QUORUM_NOT_REACHED_EMAIL",
  });
};

export const aaveQA = async () => {
  "use server";
  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";

  const [u] = await db.select().from(user).where(eq(user.address, userAddress));

  const [firstProposal] = await db
    .select()
    .from(proposal)
    .leftJoin(dao, eq(proposal.daoid, dao.id))
    .where(and(eq(proposal.state, "ACTIVE"), eq(dao.name, "Aave")))
    .orderBy(asc(proposal.timeend));

  await db.insert(notification).values({
    id: cuid(),
    userid: u.id,
    proposalid: firstProposal.proposal.id,
    type: "QUORUM_NOT_REACHED_EMAIL",
  });
};

export const uniswapQA = async () => {
  "use server";
  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";

  const [u] = await db.select().from(user).where(eq(user.address, userAddress));

  const [firstProposal] = await db
    .select()
    .from(proposal)
    .leftJoin(dao, eq(proposal.daoid, dao.id))
    .where(and(eq(proposal.state, "ACTIVE"), eq(dao.name, "Uniswap")))
    .orderBy(asc(proposal.timeend));

  await db.insert(notification).values({
    id: cuid(),
    userid: u.id,
    proposalid: firstProposal.proposal.id,
    type: "QUORUM_NOT_REACHED_EMAIL",
  });
};

export const deleteNotifs = async () => {
  "use server";
  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";

  const [u] = await db.select().from(user).where(eq(user.address, userAddress));

  await db.delete(notification).where(eq(notification.userid, u.id));
};

export const sendBulletin = async () => {
  "use server";
  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";
  const [u] = await db.select().from(user).where(eq(user.address, userAddress));

  await db.insert(notification).values({
    id: cuid(),
    userid: u.id,
    type: "BULLETIN_EMAIL",
  });
};
