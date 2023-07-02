import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "@senate/database";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;
  const userEmail = slug?.[0];
  const proposalId = slug?.[1];

  let voted = false;
  let img: string;

  const user = await prisma.user.findFirst({
    where: { email: userEmail },
    include: { voters: true },
  });

  if (!user) img = "not-voted-yet.png";
  else
    for (const voter of user.voters) {
      const vote = await prisma.vote.findFirst({
        where: { voteraddress: voter.address, proposalid: proposalId },
      });

      if (vote) voted = true;
    }

  if (voted) img = "voted.png";
  else {
    const proposal = await prisma.proposal.findFirst({
      where: { id: proposalId },
      select: { timeend: true },
    });

    if (!proposal) {
      img = "did-not-vote.png";
    } else {
      if (proposal.timeend.getTime() > Date.now()) img = "not-voted-yet.png";
      else img = "did-not-vote.png";
    }
  }
  const dirRelativeToPublicFolder = "assets/Emails";
  const dir = path.resolve(process.cwd(), "public", dirRelativeToPublicFolder);

  fs.readFile(path.join(dir, img), function (err, data) {
    if (err) {
      res.status(500).send("Error loading image");
    } else {
      res.writeHead(200, {
        "Content-Type": "image/png",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0",
        Pragma: "no-cache",
      });
      res.end(data, "binary");
    }
  });
}
