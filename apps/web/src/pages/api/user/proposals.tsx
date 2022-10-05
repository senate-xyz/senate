// Example of a restricted endpoint that only authenticated users can access from https://next-auth.js.org/getting-started/example

import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { prisma } from "@senate/database";

// returns all DAOs
// in case user is subscribed to one them, includes the corresponding subscription

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (session) {
    const user = await prisma.user
      .findFirstOrThrow({
        where: {
          address: session.user.id,
        },
        select: {
          id: true,
        },
      })
      .catch(() => {
        res.status(404);
        return { id: "0" };
      });

    const userSubscriptions = await prisma.subscription.findMany({
      where: {
        AND: {
          userId: user?.id,
        },
      },
      select: {
        daoId: true,
      },
    });

    const userProposals = await prisma.proposal.findMany({
      where: {
        daoId: {
          in: userSubscriptions.map((sub: any) => sub.daoId),
        },
      },
      include: {
        dao: {
          include: {
            handlers: true,
          },
        },
        votes: {
          where: {
            userId: user?.id,
          },
          include: {
            user: true,
          },
        },
      },
    });

    res.send(userProposals);
  } else {
    res.send({
      error:
        "You must be signed in to view the protected content on this page.",
    });
  }
};

export default restricted;
