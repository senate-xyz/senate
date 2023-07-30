import {
  mysqlTable,
  unique,
  varchar,
  int,
  datetime,
  mysqlEnum,
  json,
  bigint,
  boolean,
} from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";

export const userTovoter = mysqlTable(
  "_userTovoter",
  {
    a: varchar("A", { length: 191 }).notNull(),
    b: varchar("B", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      userTovoterAbUnique: unique("_userTovoter_AB_unique").on(
        table.a,
        table.b,
      ),
    };
  },
);

export const userTovoterRelations = relations(userTovoter, ({ one }) => ({
  group: one(voter, {
    fields: [userTovoter.b],
    references: [voter.id],
  }),
  user: one(user, {
    fields: [userTovoter.a],
    references: [user.id],
  }),
}));

export const config = mysqlTable("config", {
  key: varchar("key", { length: 191 }).unique().notNull(),
  value: int("value").notNull(),
});

export const dao = mysqlTable("dao", {
  id: varchar("id", { length: 191 }).unique().notNull(),
  name: varchar("name", { length: 191 }).primaryKey().unique().notNull(),
  picture: varchar("picture", { length: 191 }).notNull(),
  quorumwarningemailsupport: boolean("quorumwarningemailsupport")
    .default(false)
    .notNull(),
});

export const daoRelations = relations(dao, ({ many }) => ({
  handlers: many(daohandler),
  proposals: many(proposal),
  subscriptions: many(subscription),
  votes: many(vote),
}));

export const daohandler = mysqlTable("daohandler", {
  id: varchar("id", { length: 191 }).primaryKey().unique().notNull(),
  type: mysqlEnum("type", [
    "AAVE_CHAIN",
    "COMPOUND_CHAIN",
    "UNISWAP_CHAIN",
    "ENS_CHAIN",
    "GITCOIN_CHAIN",
    "HOP_CHAIN",
    "DYDX_CHAIN",
    "MAKER_EXECUTIVE",
    "MAKER_POLL",
    "MAKER_POLL_ARBITRUM",
    "INTEREST_PROTOCOL_CHAIN",
    "ZEROX_PROTOCOL_CHAIN",
    "SNAPSHOT",
  ]).notNull(),
  decoder: json("decoder").notNull(),
  chainindex: bigint("chainindex", { mode: "number" }).default(0).notNull(),
  snapshotindex: datetime("snapshotindex", {
    mode: "date",
    fsp: 3,
  })
    .default(new Date(0))
    .notNull(),
  uptodate: boolean("uptodate").default(false).notNull(),
  daoid: varchar("daoid", { length: 191 }).notNull(),
});

export const daohandlerRelations = relations(daohandler, ({ many, one }) => ({
  dao: one(dao, {
    fields: [daohandler.daoid],
    references: [dao.id],
  }),
  proposals: many(proposal),
  voterhandlers: many(voterhandler),
  votes: many(vote),
}));

export const notification = mysqlTable("notification", {
  id: varchar("id", { length: 191 }).primaryKey().unique().notNull(),
  userid: varchar("userid", { length: 191 }).notNull(),
  proposalid: varchar("proposalid", { length: 191 }),
  type: mysqlEnum("type", [
    "QUORUM_NOT_REACHED_EMAIL",
    "BULLETIN_EMAIL",
    "NEW_PROPOSAL_DISCORD",
    "FIRST_REMINDER_DISCORD",
    "SECOND_REMINDER_DISCORD",
    "THIRD_REMINDER_DISCORD",
    "ENDED_PROPOSAL_DISCORD",
    "NEW_PROPOSAL_TELEGRAM",
    "FIRST_REMINDER_TELEGRAM",
    "SECOND_REMINDER_TELEGRAM",
    "THIRD_REMINDER_TELEGRAM",
    "ENDED_PROPOSAL_TELEGRAM",
  ]).notNull(),
  dispatchstatus: mysqlEnum("dispatchstatus", [
    "NOT_DISPATCHED",
    "FIRST_RETRY",
    "SECOND_RETRY",
    "THIRD_RETRY",
    "DISPATCHED",
    "DELETED",
    "FAILED",
  ])
    .default("NOT_DISPATCHED")
    .notNull(),
  emailmessageid: varchar("emailmessageid", { length: 191 }),
  discordmessagelink: varchar("discordmessagelink", { length: 191 }),
  discordmessageid: varchar("discordmessageid", { length: 191 }),
  telegramchatid: varchar("telegramchatid", { length: 191 }),
  telegrammessageid: varchar("telegrammessageid", { length: 191 }),
  emailtemplate: varchar("emailtemplate", { length: 191 }),
});

export const notificationRelations = relations(notification, ({ one }) => ({
  user: one(user, {
    fields: [notification.userid],
    references: [user.id],
  }),
  proposal: one(proposal, {
    fields: [notification.proposalid],
    references: [proposal.id],
  }),
}));

export const proposal = mysqlTable("proposal", {
  id: varchar("id", { length: 191 }).primaryKey().unique().notNull(),
  name: varchar("name", { length: 2048 }).notNull(),
  externalid: varchar("externalid", { length: 191 }).notNull(),
  choices: json("choices").notNull(),
  scores: json("scores").notNull(),
  scorestotal: json("scorestotal").notNull(),
  quorum: json("quorum").notNull(),
  state: mysqlEnum("state", [
    "PENDING",
    "ACTIVE",
    "CANCELED",
    "DEFEATED",
    "SUCCEEDED",
    "QUEUED",
    "EXPIRED",
    "EXECUTED",
    "HIDDEN",
    "UNKNOWN",
  ]).notNull(),
  blockcreated: bigint("blockcreated", { mode: "number" }),
  timecreated: datetime("timecreated", { mode: "date", fsp: 3 }).notNull(),
  timestart: datetime("timestart", { mode: "date", fsp: 3 }).notNull(),
  timeend: datetime("timeend", { mode: "date", fsp: 3 }).notNull(),
  url: varchar("url", { length: 1024 }).notNull(),
  daohandlerid: varchar("daohandlerid", { length: 191 }).notNull(),
  daoid: varchar("daoid", { length: 191 }).notNull(),
  visible: boolean("visible").default(true).notNull(),
});

export const proposalRelations = relations(proposal, ({ many, one }) => ({
  votes: many(vote),
  notifications: many(notification),
  dao: one(dao, {
    fields: [proposal.daoid],
    references: [dao.id],
  }),
  daohandler: one(daohandler, {
    fields: [proposal.daohandlerid],
    references: [daohandler.id],
  }),
}));

export const subscription = mysqlTable("subscription", {
  id: varchar("id", { length: 191 }).primaryKey().unique().notNull(),
  userid: varchar("userid", { length: 191 }).notNull(),
  daoid: varchar("daoid", { length: 191 }).notNull(),
});

export const subscriptionRelations = relations(subscription, ({ one }) => ({
  dao: one(dao, {
    fields: [subscription.daoid],
    references: [dao.id],
  }),
  user: one(user, {
    fields: [subscription.userid],
    references: [user.id],
  }),
}));

export const user = mysqlTable("user", {
  id: varchar("id", { length: 191 }).primaryKey().unique().notNull(),
  address: varchar("address", { length: 191 }),
  email: varchar("email", { length: 191 }),
  verifiedaddress: boolean("verifiedaddress").default(false).notNull(),
  verifiedemail: boolean("verifiedemail").default(false).notNull(),
  isuniswapuser: mysqlEnum("isuniswapuser", [
    "DISABLED",
    "VERIFICATION",
    "ENABLED",
  ])
    .default("DISABLED")
    .notNull(),
  isaaveuser: mysqlEnum("isaaveuser", ["DISABLED", "VERIFICATION", "ENABLED"])
    .default("DISABLED")
    .notNull(),
  challengecode: varchar("challengecode", { length: 191 })
    .default("")
    .notNull(),
  emaildailybulletin: boolean("emaildailybulletin").default(false).notNull(),
  emptydailybulletin: boolean("emptydailybulletin").default(false).notNull(),
  emailquorumwarning: boolean("emailquorumwarning").default(true).notNull(),
  discordnotifications: boolean("discordnotifications")
    .default(false)
    .notNull(),
  discordreminders: boolean("discordreminders").default(true).notNull(),
  discordincludevotes: boolean("discordincludevotes").default(true).notNull(),
  discordwebhook: varchar("discordwebhook", { length: 191 })
    .default("")
    .notNull(),
  telegramnotifications: boolean("telegramnotifications")
    .default(false)
    .notNull(),
  telegramreminders: boolean("telegramreminders").default(true).notNull(),
  telegramincludevotes: boolean("telegramincludevotes").default(true).notNull(),
  telegramchatid: varchar("telegramchatid", { length: 191 })
    .default("")
    .notNull(),
  acceptedterms: boolean("acceptedterms").default(false).notNull(),
  acceptedtermstimestamp: datetime("acceptedtermstimestamp", {
    mode: "date",
    fsp: 3,
  }),
  firstactive: datetime("firstactive", { mode: "date", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  lastactive: datetime("lastactive", { mode: "date", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  sessioncount: int("sessioncount").default(0).notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  subscriptions: many(subscription),
  usersToVoters: many(userTovoter),
  notifications: many(notification),
}));

export const vote = mysqlTable("vote", {
  id: varchar("id", { length: 191 }).primaryKey().unique().notNull(),
  choice: json("choice").notNull(),
  votingpower: json("votingpower").notNull(),
  reason: varchar("reason", { length: 2048 }).notNull(),
  voteraddress: varchar("voteraddress", { length: 191 }).notNull(),
  proposalid: varchar("proposalid", { length: 191 }).notNull(),
  daoid: varchar("daoid", { length: 191 }).notNull(),
  daohandlerid: varchar("daohandlerid", { length: 191 }).notNull(),
  blockcreated: bigint("blockcreated", { mode: "number" }),
  timecreated: datetime("timecreated", { mode: "date", fsp: 3 }),
});

export const voteRelations = relations(vote, ({ one }) => ({
  voteraddress: one(voter, {
    fields: [vote.voteraddress],
    references: [voter.address],
  }),
  proposal: one(proposal, {
    fields: [vote.proposalid],
    references: [proposal.id],
  }),
  dao: one(dao, {
    fields: [vote.daoid],
    references: [dao.id],
  }),
  daohandler: one(daohandler, {
    fields: [vote.daohandlerid],
    references: [daohandler.id],
  }),
}));

export const voter = mysqlTable("voter", {
  id: varchar("id", { length: 191 }).primaryKey().unique().notNull(),
  address: varchar("address", { length: 191 }).unique().notNull(),
});

export const voterRelations = relations(voter, ({ many }) => ({
  usersToVoters: many(userTovoter),
}));

export const voterhandler = mysqlTable("voterhandler", {
  id: varchar("id", { length: 191 }).primaryKey().unique().notNull(),
  chainindex: bigint("chainindex", { mode: "number" }).default(0).notNull(),
  snapshotindex: datetime("snapshotindex", {
    mode: "date",
    fsp: 3,
  })
    .default(new Date(0))
    .notNull(),
  uptodate: boolean("uptodate").default(false).notNull(),
  daohandlerid: varchar("daohandlerid", { length: 191 }).notNull(),
  voterid: varchar("voterid", { length: 191 }).notNull(),
});

export const voterhandlerRelations = relations(voterhandler, ({ one }) => ({
  daohandler: one(daohandler, {
    fields: [voterhandler.daohandlerid],
    references: [daohandler.id],
  }),
  voter: one(voter, {
    fields: [voterhandler.voterid],
    references: [voter.id],
  }),
}));
