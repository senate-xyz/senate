import { db, proposal, user, like } from "@senate/database";
import { redirect } from "next/navigation";
import { PostHog } from "posthog-node";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
});

async function getProposalId(slug: string) {
  const p = await db.query.proposal.findFirst({
    where: like(proposal.id, `%${slug}`),
  });

  return p ? p.id : "";
}

async function getUser(slug: string) {
  const [u] = await db
    .select()
    .from(user)
    .limit(1)
    .where(like(user.id, `%${slug}`));

  return u;
}

async function getProposal(slug: string) {
  const p = await db.query.proposal.findFirst({
    where: like(proposal.id, `%${slug}`),
    with: { dao: true },
  });

  return p;
}

async function getProposalUrl(slug: string) {
  const p = await db.query.proposal.findFirst({
    where: like(proposal.id, `%${slug}`),
  });

  return p?.url ?? "";
}

async function log(type: Type, proposalId: string, userId: string) {
  const user = await getUser(userId);
  const p = await getProposal(proposalId);

  posthog.capture({
    distinctId: user?.address ?? "visitor",
    event: type,
    properties: {
      proposalId: p ? p.id : "unknown",
      proposalUrl: p ? p.url : "unknown",
      dao: p ? p.dao.name : "unknown",
      props: {
        app: "shortie",
      },
    },
  });
}

enum Type {
  WEB = "web_frontend_click",
  EMAIL_BULLETIN = "email_bulletin_click",
  EMAIL_QUORUM = "email_quorum_click",
  DISCORD = "discord_click",
  TELEGRAM = "telegram_click",
  UNKNOWN = "unknown_click",
}

export default async function Page({ params }: { params: { slug: string } }) {
  if (params.slug.length < 2) redirect("https://senatelabs.xyz");

  const proposalId = await getProposalId(params.slug[0]);

  let type;
  switch (params.slug[1]) {
    case "w": {
      type = Type.WEB;
      break;
    }
    case "b": {
      type = Type.EMAIL_BULLETIN;
      break;
    }
    case "q": {
      type = Type.EMAIL_QUORUM;
      break;
    }
    case "d": {
      type = Type.DISCORD;
      break;
    }
    case "t": {
      type = Type.TELEGRAM;
      break;
    }
    default: {
      type = Type.UNKNOWN;
      break;
    }
  }

  const userId = params.slug[2];

  await log(type, proposalId, userId);

  const url = await getProposalUrl(proposalId);

  if (url) {
    if (url.includes("snapshot")) redirect(url + "?app=senate");
    else redirect(url);
  } else redirect("https://www.senatelabs.xyz/proposals/active");
}
