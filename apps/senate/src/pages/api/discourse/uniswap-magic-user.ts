import { type NextApiRequest, type NextApiResponse } from "next";
import { MagicUserState, prisma } from "@senate/database";
import { z } from "zod";
import { ServerClient } from "postmark";

const emailClient = new ServerClient(
  process.env.POSTMARK_TOKEN ?? "Missing Token",
);

interface RequestBody {
  email: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  const { email } = req.body as RequestBody;

  const existingUser = await prisma.user.findFirst({
    where: { email: email },
  });

  if (existingUser) {
    if (existingUser.verifiedemail && existingUser.isuniswapuser == "ENABLED") {
      res.status(200).json({
        email: existingUser.email,
        result: "existing",
      });
    } else if (
      existingUser.verifiedemail &&
      existingUser.isuniswapuser != "ENABLED"
    ) {
      const challengeCode = Math.random().toString(36).substring(2);

      await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          isuniswapuser: MagicUserState.VERIFICATION,
          challengecode: challengeCode,
        },
      });

      await emailClient.sendEmailWithTemplate({
        From: "info@senatelabs.xyz",
        To: String(existingUser.email),
        TemplateAlias: "uniswap-confirm",
        TemplateModel: {
          todaysDate: new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          url: `${
            process.env.NEXT_PUBLIC_WEB_URL ?? ""
          }/verify/subscribe-discourse/uniswap/${challengeCode}`,
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
            process.env.NEXT_PUBLIC_WEB_URL ?? ""
          }/verify/verify-email/${challengeCode}`,
        },
      });

      res.status(200).json({
        email: email,
        result: "failed",
      });
    }
  } else {
    const schema = z.coerce.string().email();

    try {
      schema.parse(email);
    } catch {
      res.status(500).json({ email: email, result: "failed" });
      return;
    }

    const challengeCode = Math.random().toString(36).substring(2);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        verifiedemail: false,
        isuniswapuser: MagicUserState.VERIFICATION,
        emaildailybulletin: true,
        emailquorumwarning: true,
        challengecode: challengeCode,
      },
    });

    await emailClient.sendEmailWithTemplate({
      From: "info@senatelabs.xyz",
      To: String(newUser.email),
      TemplateAlias: "uniswap-validate",
      TemplateModel: {
        todaysDate: new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        url: `${
          process.env.NEXT_PUBLIC_WEB_URL ?? ""
        }/verify/signup-discourse/uniswap/${challengeCode}`,
      },
    });

    res.status(200).json({
      email: newUser.email,
      result: "success",
    });
  }
}
