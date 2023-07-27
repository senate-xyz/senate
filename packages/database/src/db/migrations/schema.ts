import {
  mysqlTable,
  unique,
  varchar,
  int,
  datetime,
  tinyint,
  mysqlEnum,
  json,
  bigint,
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

export const config = mysqlTable("config", {
  key: varchar("key", { length: 191 }).notNull(),
  value: int("value").notNull(),
});

export const dao = mysqlTable("dao", {
  id: varchar("id", { length: 191 }).notNull(),
  name: varchar("name", { length: 191 }).notNull(),
  picture: varchar("picture", { length: 191 }).notNull(),
  createdat: datetime("createdat", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedat: datetime("updatedat", { mode: "string", fsp: 3 }).notNull(),
  quorumwarningemailsupport: tinyint("quorumwarningemailsupport")
    .default(0)
    .notNull(),
});

export const daoRelations = relations(dao, ({ many }) => ({
  handlers: many(daohandler),
  proposals: many(proposal),
  subscriptions: many(subscription),
  votes: many(vote),
}));

export const daohandler = mysqlTable("daohandler", {
  id: varchar("id", { length: 191 }).notNull(),
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
  chainindex: bigint("chainindex", { mode: "number" }),
  snapshotindex: datetime("snapshotindex", {
    mode: "string",
    fsp: 3,
  }).default("2000-01-01 00:00:00.000"),
  uptodate: tinyint("uptodate").default(0).notNull(),
  daoid: varchar("daoid", { length: 191 }).notNull(),
  createdat: datetime("createdat", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedat: datetime("updatedat", { mode: "string", fsp: 3 }).notNull(),
});

export const daoHandlerRelations = relations(daohandler, ({ many }) => ({
  proposals: many(proposal),
  voterhandlers: many(voterhandler),
  votes: many(vote),
}));

export const notification = mysqlTable("notification", {
  id: varchar("id", { length: 191 }).notNull(),
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
  createdat: datetime("createdat", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedat: datetime("updatedat", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
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
  id: varchar("id", { length: 191 }).notNull(),
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
  timecreated: datetime("timecreated", { mode: "string", fsp: 3 }).notNull(),
  timestart: datetime("timestart", { mode: "string", fsp: 3 }).notNull(),
  timeend: datetime("timeend", { mode: "string", fsp: 3 }).notNull(),
  url: varchar("url", { length: 1024 }).notNull(),
  daohandlerid: varchar("daohandlerid", { length: 191 }).notNull(),
  daoid: varchar("daoid", { length: 191 }).notNull(),
  createdat: datetime("createdat", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedat: datetime("updatedat", { mode: "string", fsp: 3 }).notNull(),
  visible: tinyint("visible").default(1).notNull(),
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
  id: varchar("id", { length: 191 }).notNull(),
  userid: varchar("userid", { length: 191 }).notNull(),
  daoid: varchar("daoid", { length: 191 }).notNull(),
  createdat: datetime("createdat", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedat: datetime("updatedat", { mode: "string", fsp: 3 }).notNull(),
});

export const subscriptionRelation = relations(subscription, ({ one }) => ({
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
  id: varchar("id", { length: 191 }).notNull(),
  address: varchar("address", { length: 191 }),
  email: varchar("email", { length: 191 }),
  verifiedaddress: tinyint("verifiedaddress").default(0).notNull(),
  verifiedemail: tinyint("verifiedemail").default(0).notNull(),
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
  challengecode: varchar("challengecode", { length: 191 }),
  emaildailybulletin: tinyint("emaildailybulletin").default(0).notNull(),
  emptydailybulletin: tinyint("emptydailybulletin").default(0).notNull(),
  emailquorumwarning: tinyint("emailquorumwarning").default(1).notNull(),
  discordnotifications: tinyint("discordnotifications").default(0).notNull(),
  discordreminders: tinyint("discordreminders").default(1).notNull(),
  discordincludevotes: tinyint("discordincludevotes").default(1).notNull(),
  discordwebhook: varchar("discordwebhook", { length: 191 })
    .default("")
    .notNull(),
  telegramnotifications: tinyint("telegramnotifications").default(0).notNull(),
  telegramreminders: tinyint("telegramreminders").default(1).notNull(),
  telegramincludevotes: tinyint("telegramincludevotes").default(1).notNull(),
  telegramchatid: varchar("telegramchatid", { length: 191 })
    .default("")
    .notNull(),
  acceptedterms: tinyint("acceptedterms").default(0).notNull(),
  acceptedtermstimestamp: datetime("acceptedtermstimestamp", {
    mode: "string",
    fsp: 3,
  }),
  firstactive: datetime("firstactive", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  lastactive: datetime("lastactive", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  sessioncount: int("sessioncount").default(0).notNull(),
  createdat: datetime("createdat", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedat: datetime("updatedat", { mode: "string", fsp: 3 }).notNull(),
});

export const usersRelations = relations(user, ({ many }) => ({
  daos: many(dao),
  voters: many(voter),
  notifications: many(notification),
}));

export const vote = mysqlTable("vote", {
  id: varchar("id", { length: 191 }).notNull(),
  choice: json("choice").notNull(),
  votingpower: json("votingpower").notNull(),
  reason: varchar("reason", { length: 2048 }).notNull(),
  voteraddress: varchar("voteraddress", { length: 191 }).notNull(),
  proposalid: varchar("proposalid", { length: 191 }).notNull(),
  daoid: varchar("daoid", { length: 191 }).notNull(),
  daohandlerid: varchar("daohandlerid", { length: 191 }).notNull(),
  blockcreated: bigint("blockcreated", { mode: "number" }),
  timecreated: datetime("timecreated", { mode: "string", fsp: 3 }),
  createdat: datetime("createdat", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedat: datetime("updatedat", { mode: "string", fsp: 3 }).notNull(),
});

export const voteRelations = relations(vote, ({ one }) => ({
  voter: one(voter, {
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
  id: varchar("id", { length: 191 }).notNull(),
  address: varchar("address", { length: 191 }).notNull(),
  createdat: datetime("createdat", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedat: datetime("updatedat", { mode: "string", fsp: 3 }).notNull(),
});

export const voterRelations = relations(voter, ({ many }) => ({
  votes: many(vote),
  voterhandlers: many(voterhandler),
  users: many(user),
}));

export const voterhandler = mysqlTable("voterhandler", {
  id: varchar("id", { length: 191 }).notNull(),
  chainindex: bigint("chainindex", { mode: "number" }),
  snapshotindex: datetime("snapshotindex", {
    mode: "string",
    fsp: 3,
  }).default("2000-01-01 00:00:00.000"),
  uptodate: tinyint("uptodate").default(0).notNull(),
  daohandlerid: varchar("daohandlerid", { length: 191 }).notNull(),
  voterid: varchar("voterid", { length: 191 }).notNull(),
  createdat: datetime("createdat", { mode: "string", fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedat: datetime("updatedat", { mode: "string", fsp: 3 }).notNull(),
});

export const voterHandlerRelations = relations(voterhandler, ({ one }) => ({
  voter: one(voter, {
    fields: [voterhandler.id],
    references: [voter.id],
  }),
  daohandler: one(daohandler, {
    fields: [voterhandler.daohandlerid],
    references: [daohandler.id],
  }),
}));
