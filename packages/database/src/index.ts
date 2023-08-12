import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./db/schema";
import { config } from "dotenv";
import url from "url";
config();

const databaseUrl = process.env.DATABASE_URL;

const parsedUrl = new url.URL(databaseUrl);

const username = parsedUrl.username;
const password = parsedUrl.password;
const host = parsedUrl.hostname;
const database = parsedUrl.pathname.split("/")[1];

const connection = mysql.createPool({
  host: host,
  user: username,
  password: password,
  database: database,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const db = drizzle(connection, { schema, mode: "planetscale" });

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
