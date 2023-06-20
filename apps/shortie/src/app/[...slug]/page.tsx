import { prisma } from "@senate/database";
import { redirect } from "next/navigation";
import { PostHog } from "posthog-node";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL || ""}/ingest`,
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
  let user = await getUser(userId);
  let proposal = await getProposal(proposalId);

  if (user) posthog.identify({ distinctId: user.address });
  else posthog.identify({ distinctId: "visitor" });

  posthog.capture({
    distinctId: user ? user.address : "visitor",
    event: type,
    properties: {
      proposalId: proposal ? proposal.id : "unknown",
      proposalUrl: proposal ? proposal.url : "unknown",
      dao: proposal ? proposal.dao.name : "unknown",
    },
  });
}

enum Type {
  WEB = "click_web",
  EMAIL_BULLETIN = "click_bulletin",
  EMAIL_QUORUM = "click_quorum",
  DISCORD = "click_discord",
  TELEGRAM = "click_telegram",
  UNKNOWN = "click_unknown",
}

export default async function Page({ params }: { params: { slug: string } }) {
  if (params.slug.length < 2) redirect("https://senatelabs.xyz");

  let proposalId = await getProposalId(params.slug[0]);

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

  let userId = params.slug[2];

  await log(type, proposalId, userId);

  const url = await getProposalUrl(proposalId);

  if (url) {
    if (url.includes("snapshot")) redirect(url + "?app=senate");
    else redirect(url);
  } else redirect("https://senatelabs.xyz");
}
