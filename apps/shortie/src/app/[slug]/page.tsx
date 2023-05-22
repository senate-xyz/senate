import { prisma } from "@senate/database";
import { redirect } from "next/navigation";

async function getProposalUrl(slug: string) {
  const proposal = await prisma.proposal.findFirstOrThrow({
    where: {
      id: {
        endsWith: slug,
      },
    },
    select: {
      url: true,
    },
  });

  return proposal.url;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const url = await getProposalUrl(params.slug);

  if (url) {
    if (url.includes("snapshot")) redirect(url + "?app=senate");
    else redirect(url);
  }
  return (
    <h1>
      {params.slug} - {url}
    </h1>
  );
}
