import { prisma } from "@senate/database";
import { redirect } from "next/navigation";

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

export default async function Page({ params }: { params: { slug: string } }) {
  const url = await getProposalUrl(params.slug);

  if (url) {
    if (url.includes("snapshot")) redirect(url + "?app=senate");
    else redirect(url);
  } else redirect("https://senatelabs.xyz");
}
