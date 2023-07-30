import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";
import { ServerClient } from "postmark";
import { PostHog } from "posthog-node";
import { db, eq, user } from "@senate/database";
import cuid from "cuid";

const emailClient = new ServerClient(
  process.env.POSTMARK_TOKEN ?? "Missing Token",
);

interface RequestBody {
  email: string;
}

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  const { email: emailInput } = req.body as RequestBody;

  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, emailInput),
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

      await db
        .update(user)
        .set({ isaaveuser: "VERIFICATION", challengecode: challengeCode })
        .where(eq(user.id, existingUser.id));

      posthog.capture({
        distinctId: String(existingUser.address),
        event: "subscribe_discourse_aave",
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
            process.env.NEXT_PUBLIC_WEB_URL ?? ""
          }/verify/subscribe-discourse/aave/${challengeCode}`,
        },
      });

      res.status(200).json({
        email: existingUser.email,
        result: "success",
        url: `${
          process.env.NEXT_PUBLIC_WEB_URL ?? ""
        }/verify/subscribe-discourse/aave/${challengeCode}`,
      });
    } else if (!existingUser.verifiedemail) {
      const challengeCode = Math.random().toString(36).substring(2);

      await db
        .update(user)
        .set({ challengecode: challengeCode })
        .where(eq(user.id, existingUser.id));

      posthog.capture({
        distinctId: String(existingUser.email),
        event: "subscribe_discourse_aave",
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
            process.env.NEXT_PUBLIC_WEB_URL ?? ""
          }/verify/verify-email/${challengeCode}`,
        },
      });

      res.status(200).json({
        email: emailInput,
        result: "failed",
        url: `${
          process.env.NEXT_PUBLIC_WEB_URL ?? ""
        }/verify/verify-email/${challengeCode}`,
      });
    }
  } else {
    const schema = z.coerce.string().email();

    try {
      schema.parse(emailInput);
    } catch {
      res.status(500).json({ email: emailInput, result: "failed" });
      return;
    }

    const challengeCode = Math.random().toString(36).substring(2);

    await db.insert(user).values({
      id: cuid(),
      email: emailInput,
      verifiedemail: false,
      isaaveuser: "VERIFICATION",
      emaildailybulletin: true,
      emailquorumwarning: true,
      challengecode: challengeCode,
    });

    posthog.capture({
      distinctId: String(emailInput),
      event: "signup_discourse_aave",
    });

    await emailClient.sendEmailWithTemplate({
      From: "info@senatelabs.xyz",
      To: String(emailInput),
      TemplateAlias: "aave-validate",
      TemplateModel: {
        todaysDate: new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        url: `${
          process.env.NEXT_PUBLIC_WEB_URL ?? ""
        }/verify/signup-discourse/aave/${challengeCode}`,
      },
    });

    res.status(200).json({
      email: emailInput,
      result: "success",
      url: `${
        process.env.NEXT_PUBLIC_WEB_URL ?? ""
      }/verify/signup-discourse/aave/${challengeCode}`,
    });
  }
}
