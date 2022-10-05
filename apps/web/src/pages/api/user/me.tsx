import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { prisma } from "@senate/database";

// returns current user

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
      });

    res.send(user);
  } else {
    res.send({
      error:
        "You must be signed in to view the protected content on this page.",
    });
  }
};

export default restricted;
