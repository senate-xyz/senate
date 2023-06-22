import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "@senate/database";
import { PostHog } from "posthog-node";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL || ""}/ingest`,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const { RecordType, MessageID }: { RecordType: string; MessageID: string } =
    req.body;

  const notification = await prisma.notification.findFirst({
    where: { emailmessageid: MessageID },
    include: {
      user: true,
      proposal: true,
    },
  });

  if (!notification) {
    res.status(500).send("");
    return;
  }

  switch (RecordType) {
    case "Delivery":
      posthog.capture({
        distinctId: notification.user.address,
        event: "postmark_delivery",
        properties: {
          message: MessageID,
          template: notification.emailtemplate,
          type: notification.type,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: req.body,
        },
      });
      break;
    case "Bounce":
      posthog.capture({
        distinctId: notification.user.address,
        event: "postmark_bounce",
        properties: {
          message: MessageID,
          template: notification.emailtemplate,
          type: notification.type,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: req.body,
        },
      });
      break;
    case "SpamComplaint":
      posthog.capture({
        distinctId: notification.user.address,
        event: "postmark_spamcomplaint",
        properties: {
          message: MessageID,
          template: notification.emailtemplate,
          type: notification.type,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: req.body,
        },
      });
      break;
    case "Open":
      posthog.capture({
        distinctId: notification.user.address,
        event: "postmark_open",
        properties: {
          message: MessageID,
          template: notification.emailtemplate,
          type: notification.type,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: req.body,
        },
      });
      break;
    case "Click":
      posthog.capture({
        distinctId: notification.user.address,
        event: "postmark_click",
        properties: {
          message: MessageID,
          template: notification.emailtemplate,
          type: notification.type,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: req.body,
        },
      });
      break;
    case "SubscriptionChange":
      posthog.capture({
        distinctId: notification.user.address,
        event: "postmark_subscriptionchange",
        properties: {
          message: MessageID,
          template: notification.emailtemplate,
          type: notification.type,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: req.body,
        },
      });
      break;
    default:
      break;
  }

  res.status(200).send("");
}
