import { prisma } from "@senate/database";
import { redirect } from "next/navigation";
import { PostHog } from "posthog-node";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
});

async function getProposalId(slug: string) {
  const proposal = await prisma.proposal.findFirst({
    where: {
      id: {
        endsWith: slug,
      },
    },
    select: {
      id: true,
    },
  });

  return proposal ? proposal.id : "";
}

async function getUser(slug: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: {
        endsWith: slug,
      },
    },
  });

  return user;
}

async function getProposal(slug: string) {
  const proposal = await prisma.proposal.findFirst({
    where: {
      id: {
        endsWith: slug,
      },
    },
    include: {
      dao: {
        select: {
          name: true,
        },
      },
    },
  });

  return proposal;
}

async function getProposalUrl(slug: string) {
  const proposal = await prisma.proposal.findFirst({
    where: {
      id: {
        endsWith: slug,
      },
    },
    select: {
      url: true,
    },
  });

  return proposal ? proposal.url : "";
}

async function log(type: Type, proposalId: string, userId: string) {
  const user = await getUser(userId);
  const proposal = await getProposal(proposalId);

  posthog.capture({
    distinctId: user ? user.address : "visitor",
    event: type,
    properties: {
      proposalId: proposal ? proposal.id : "unknown",
      proposalUrl: proposal ? proposal.url : "unknown",
      dao: proposal ? proposal.dao.name : "unknown",
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
