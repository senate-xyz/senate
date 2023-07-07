import { prisma } from "@senate/database";
import { expect, test } from "@playwright/test";

test("delete test user", async () => {
  await prisma.subscription.deleteMany({
    where: {
      user: {
        address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      },
    },
  });

  await prisma.notification.deleteMany({
    where: {
      user: {
        address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      },
    },
  });

  await prisma.user.deleteMany({
    where: { address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" },
  });

  const user = prisma.user.findMany({
    where: {
      address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    },
  });

  await expect(user).toBeNull();
});
