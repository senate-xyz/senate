import { db, eq, notification, subscription, user } from "@senate/database";
import { expect, test } from "@playwright/test";

test("delete test user", async () => {
  const [u] = await db
    .select()
    .from(user)
    .where(eq(user.address, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"));

  if (u) {
    await db.delete(subscription).where(eq(subscription.userid, u.id));
    await db.delete(notification).where(eq(notification.userid, u.id));
    await db.delete(user).where(eq(user.id, u.id));
  }

  const [old_u] = await db
    .select()
    .from(user)
    .where(eq(user.address, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"));

  await expect(old_u).toBeUndefined();
});
