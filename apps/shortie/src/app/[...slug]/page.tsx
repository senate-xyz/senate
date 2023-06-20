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

async function getUserId(slug: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: {
        endsWith: slug,
      },
    },
  });

  return user ? user.id : "";
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

  if (!user || !proposal) return;

  posthog.capture({
    distinctId: user.address,
    event: type,
    properties: {
      proposalId: proposal.id,
      proposalUrl: proposal.url,
      dao: proposal.dao.name,
    },
  });

  console.log({
    distinctId: user.address,
    event: type,
    properties: {
      proposalId: proposal.id,
      proposalUrl: proposal.url,
      dao: proposal.dao.name,
    },
  });
}

enum Type {
  EMAIL_BULLETIN = "click_bulletin",
  EMAIL_QUORUM = "click_quorum",
  DISCORD = "click_discord",
  TELEGRAM = "click_telegram",
  UNKNOWN = "click_unknown",
}

export default async function Page({ params }: { params: { slug: string } }) {
  if (params.slug.length != 3) redirect("https://senatelabs.xyz");

  let type;
  switch (params.slug[0]) {
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

  let proposalId = await getProposalId(params.slug[1]);
  let userId = await getUserId(params.slug[2]);

  await log(type, proposalId, userId);

  const url = await getProposalUrl(proposalId);

  // if (url) {
  //   if (url.includes("snapshot")) redirect(url + "?app=senate");
  //   else redirect(url);
  // } else redirect("https://senatelabs.xyz");
}
