import { type NextApiRequest, type NextApiResponse } from "next";
import { MagicUserState, prisma } from "@senate/database";
import { z } from "zod";
import { ServerClient } from "postmark";
import { PostHog } from "posthog-node";

const emailClient = new ServerClient(
  process.env.POSTMARK_TOKEN ?? "Missing Token"
);

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL || ""}/ingest`,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const email = req.body.email;

  const existingUser = await prisma.user.findFirst({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    where: { email: email },
  });

  if (existingUser) {
    if (existingUser.verifiedemail && existingUser.isaaveuser == "ENABLED") {
      res.status(200).json({
        email: existingUser.email,
        result: "existing",
      });
    } else if (
      existingUser.verifiedemail &&
      existingUser.isaaveuser != "ENABLED"
    ) {
      const challengeCode = Math.random().toString(36).substring(2);

      await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          isaaveuser: MagicUserState.VERIFICATION,
          challengecode: challengeCode,
        },
      });

      await emailClient.sendEmailWithTemplate({
        From: "info@senatelabs.xyz",
        To: String(existingUser.email),
        TemplateAlias: "aave-confirm",
        TemplateModel: {
          todaysDate: new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          url: `${
            process.env.NEXT_PUBLIC_WEB_URL || ""
          }/verify/subscribe-discourse/aave/${challengeCode}`,
        },
      });

      res.status(200).json({
        email: existingUser.email,
        result: "success",
      });
    } else if (!existingUser.verifiedemail) {
      const challengeCode = Math.random().toString(36).substring(2);

      await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          challengecode: challengeCode,
        },
      });

      await emailClient.sendEmailWithTemplate({
        From: "info@senatelabs.xyz",
        To: String(existingUser.email),
        TemplateAlias: "senate-confirm",
        TemplateModel: {
          todaysDate: new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          url: `${
            process.env.NEXT_PUBLIC_WEB_URL || ""
          }/verify/verify-email/${challengeCode}`,
        },
      });

      res.status(200).json({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        email: email,
        result: "failed",
      });
    }
  } else {
    const schema = z.coerce.string().email();

    try {
      schema.parse(email);
    } catch {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      res.status(500).json({ email: email, result: "failed" });
      return;
    }

    const challengeCode = Math.random().toString(36).substring(2);

    const newUser = await prisma.user.create({
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        email: email,
        verifiedemail: false,
        isaaveuser: MagicUserState.VERIFICATION,
        emaildailybulletin: true,
        emailquorumwarning: true,
        challengecode: challengeCode,
      },
    });

    await emailClient.sendEmailWithTemplate({
      From: "info@senatelabs.xyz",
      To: String(newUser.email),
      TemplateAlias: "aave-validate",
      TemplateModel: {
        todaysDate: new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        url: `${
          process.env.NEXT_PUBLIC_WEB_URL || ""
        }/verify/signup-discourse/aave/${challengeCode}`,
      },
    });

    res.status(200).json({
      email: newUser.email,
      result: "success",
    });
  }
}
