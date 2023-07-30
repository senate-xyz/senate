import { db, eq, user } from "@senate/database";
import { redirect } from "next/navigation";

export const isValidChallenge = async (challenge: string) => {
  "use server";
  const c = await db
    .select({ challenge: user.challengecode })
    .from(user)
    .where(eq(user.challengecode, challenge));

  return c ? true : false;
};

export const verifyUser = async (challenge: string) => {
  "use server";

  await db
    .update(user)
    .set({ challengecode: "", verifiedemail: true })
    .where(eq(user.challengecode, challenge));

  redirect("/orgs");
};
