import { type NextApiRequest, type NextApiResponse } from "next";
import {
  db,
  user,
  and,
  eq,
  inArray,
  proposal,
  userTovoter,
  vote,
  voter,
} from "@senate/database";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { slug } = req.query;
  const userEmail = slug?.[0];
  const proposalId = slug?.[1];

  let img: string = "did-not-vote.png";

  if (userEmail) {
    const proxies = await db
      .select()
      .from(userTovoter)
      .leftJoin(user, eq(userTovoter.a, user.id))
      .leftJoin(voter, eq(userTovoter.b, voter.id))
      .where(eq(user.email, userEmail ?? ""));

    const votersAddresses = proxies.map((p) =>
      p.voter ? p.voter?.address : "",
    );

    const [p] = await db
      .select()
      .from(proposal)
      .leftJoin(
        vote,
        and(
          eq(proposal.id, vote.proposalid),
          inArray(vote.voteraddress, votersAddresses),
        ),
      )
      .where(eq(proposal.id, proposalId ?? ""));

    if (p.proposal.timeend.getTime() < Date.now()) {
      if (p.vote) img = "voted.png";
      else img = "not-voted-yet.png";
    } else {
      if (p.vote) img = "voted.png";
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
          "no-cache,no-store,must-revalidate,max-age=0,proxy-revalidate,no-transform,private",
        Pragma: "no-cache",
        "CF-Cache-Status": "DYNAMIC",
        Expires: -1,
      });
      res.end(data, "binary");
    }
  });
}
