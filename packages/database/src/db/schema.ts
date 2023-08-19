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
  index,
  primaryKey,
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
      bIdx: index("_userTovoter_B_index").on(table.b),
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

export const config = mysqlTable(
  "config",
  {
    key: varchar("key", { length: 191 }).notNull(),
    value: int("value").notNull(),
  },
  (table) => {
    return {
      keyIdx: index("config_key_idx").on(table.key),
      configKey: primaryKey(table.key),
    };
  },
);

export const dao = mysqlTable(
  "dao",
  {
    id: varchar("id", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    picture: varchar("picture", { length: 191 }).notNull(),
    backgroundcolor: varchar("backgroundcolor", { length: 191 }).notNull(),
    quorumwarningemailsupport: boolean("quorumwarningemailsupport")
      .default(false)
      .notNull(),
  },
  (table) => {
    return {
      nameIdx: index("dao_name_idx").on(table.name),
      daoId: primaryKey(table.id),
      daoNameKey: unique("dao_name_key").on(table.name),
    };
  },
);

export const daoRelations = relations(dao, ({ many }) => ({
  handlers: many(daohandler),
  proposals: many(proposal),
  subscriptions: many(subscription),
  votes: many(vote),
}));

export const daohandler = mysqlTable(
  "daohandler",
  {
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
      "OPTIMISM_CHAIN",
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
  },
  (table) => {
    return {
      daoidIdx: index("daohandler_daoid_idx").on(table.daoid),
      daohandlerId: primaryKey(table.id),
      daohandlerDaoidTypeKey: unique("daohandler_daoid_type_key").on(
        table.daoid,
        table.type,
      ),
    };
  },
);

export const daohandlerRelations = relations(daohandler, ({ many, one }) => ({
  dao: one(dao, {
    fields: [daohandler.daoid],
    references: [dao.id],
  }),
  proposals: many(proposal),
  voterhandlers: many(voterhandler),
  votes: many(vote),
}));

export const notification = mysqlTable(
  "notification",
  {
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
    emailtemplate: varchar("emailtemplate", { length: 191 }),
  },
  (table) => {
    return {
      useridIdx: index("notification_userid_idx").on(table.userid),
      proposalidIdx: index("notification_proposalid_idx").on(table.proposalid),
      typeIdx: index("notification_type_idx").on(table.type),
      dispatchstatusIdx: index("notification_dispatchstatus_idx").on(
        table.dispatchstatus,
      ),
      notificationId: primaryKey(table.id),
      notificationUseridProposalidTypeKey: unique(
        "notification_userid_proposalid_type_key",
      ).on(table.userid, table.proposalid, table.type),
    };
  },
);

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

export const proposal = mysqlTable(
  "proposal",
  {
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
    timecreated: datetime("timecreated", { mode: "date", fsp: 3 }).notNull(),
    timestart: datetime("timestart", { mode: "date", fsp: 3 }).notNull(),
    timeend: datetime("timeend", { mode: "date", fsp: 3 }).notNull(),
    url: varchar("url", { length: 1024 }).notNull(),
    daohandlerid: varchar("daohandlerid", { length: 191 }).notNull(),
    daoid: varchar("daoid", { length: 191 }).notNull(),
    visible: boolean("visible").default(true).notNull(),
  },
  (table) => {
    return {
      timeendIdx: index("proposal_timeend_idx").on(table.timeend),
      visibleIdx: index("proposal_visible_idx").on(table.visible),
      stateIdx: index("proposal_state_idx").on(table.state),
      daohandleridIdx: index("proposal_daohandlerid_idx").on(
        table.daohandlerid,
      ),
      daoidIdx: index("proposal_daoid_idx").on(table.daoid),
      proposalId: primaryKey(table.id),
      proposalExternalidDaoidKey: unique("proposal_externalid_daoid_key").on(
        table.externalid,
        table.daoid,
      ),
    };
  },
);

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

export const subscription = mysqlTable(
  "subscription",
  {
    id: varchar("id", { length: 191 }).notNull(),
    userid: varchar("userid", { length: 191 }).notNull(),
    daoid: varchar("daoid", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      useridIdx: index("subscription_userid_idx").on(table.userid),
      daoidIdx: index("subscription_daoid_idx").on(table.daoid),
      subscriptionId: primaryKey(table.id),
      subscriptionUseridDaoidKey: unique("subscription_userid_daoid_key").on(
        table.userid,
        table.daoid,
      ),
    };
  },
);

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

export const user = mysqlTable(
  "user",
  {
    id: varchar("id", { length: 191 }).notNull(),
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
    telegramincludevotes: boolean("telegramincludevotes")
      .default(true)
      .notNull(),
    telegramchatid: varchar("telegramchatid", { length: 191 })
      .default("")
      .notNull(),
    telegramchattitle: varchar("telegramchattitle", { length: 1024 })
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
  },
  (table) => {
    return {
      emailIdx: index("user_email_idx").on(table.email),
      addressIdx: index("user_address_idx").on(table.address),
      userId: primaryKey(table.id),
      userAddressKey: unique("user_address_key").on(table.address),
      userEmailKey: unique("user_email_key").on(table.email),
    };
  },
);

export const userRelations = relations(user, ({ many }) => ({
  subscriptions: many(subscription),
  usersToVoters: many(userTovoter),
  notifications: many(notification),
}));

export const vote = mysqlTable(
  "vote",
  {
    id: varchar("id", { length: 191 }).notNull(),
    choice: json("choice").notNull(),
    votingpower: json("votingpower").notNull(),
    reason: varchar("reason", { length: 2048 }).notNull(),
    voteraddress: varchar("voteraddress", { length: 191 }).notNull(),
    proposalid: varchar("proposalid", { length: 191 }).notNull(),
    daoid: varchar("daoid", { length: 191 }).notNull(),
    daohandlerid: varchar("daohandlerid", { length: 191 }).notNull(),
    blockcreated: bigint("blockcreated", { mode: "number" }),
    timecreated: datetime("timecreated", { mode: "date", fsp: 3 }),
  },
  (table) => {
    return {
      voteraddressIdx: index("vote_voteraddress_idx").on(table.voteraddress),
      proposalidIdx: index("vote_proposalid_idx").on(table.proposalid),
      daoidIdx: index("vote_daoid_idx").on(table.daoid),
      daohandleridIdx: index("vote_daohandlerid_idx").on(table.daohandlerid),
      voteId: primaryKey(table.id),
      voteVoteraddressDaoidProposalidKey: unique(
        "vote_voteraddress_daoid_proposalid_key",
      ).on(table.voteraddress, table.daoid, table.proposalid),
    };
  },
);

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

export const voter = mysqlTable(
  "voter",
  {
    id: varchar("id", { length: 191 }).notNull(),
    address: varchar("address", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      addressIdx: index("voter_address_idx").on(table.address),
      voterId: primaryKey(table.id),
      voterAddressKey: unique("voter_address_key").on(table.address),
    };
  },
);

export const voterRelations = relations(voter, ({ many }) => ({
  usersToVoters: many(userTovoter),
}));

export const voterhandler = mysqlTable(
  "voterhandler",
  {
    id: varchar("id", { length: 191 }).notNull(),
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
  },
  (table) => {
    return {
      daohandleridIdx: index("voterhandler_daohandlerid_idx").on(
        table.daohandlerid,
      ),
      voteridIdx: index("voterhandler_voterid_idx").on(table.voterid),
      voterhandlerId: primaryKey(table.id),
      voterhandlerVoteridDaohandleridKey: unique(
        "voterhandler_voterid_daohandlerid_key",
      ).on(table.voterid, table.daohandlerid),
    };
  },
);

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
