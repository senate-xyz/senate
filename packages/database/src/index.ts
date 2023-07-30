import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import * as schema from "./db/schema";
import { config } from "dotenv";
config();

const connection = connect({
  url: process.env.DB_DRIZZLE,
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
