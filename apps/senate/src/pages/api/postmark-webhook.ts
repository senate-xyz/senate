import { type NextApiRequest, type NextApiResponse } from "next";
import { db, eq, notification } from "@senate/database";
import { PostHog } from "posthog-node";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
});

interface RequestBody {
  RecordType: string;
  MessageID: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { RecordType, MessageID }: RequestBody = req.body as RequestBody;

  const n = await db.query.notification.findFirst({
    where: eq(notification.emailmessageid, MessageID),
    with: {
      user: true,
      proposal: true,
    },
  });

  if (!n) {
    res.status(500).send("");
    return;
  }

  switch (RecordType) {
    case "Delivery":
      posthog.capture({
        distinctId: n.user.address ?? "unknown",
        event: "postmark_delivery",
        properties: {
          message: MessageID,
          template: n.emailtemplate,
          type: n.type,
          data: req.body as RequestBody,
          props: {
            app: "postmark",
          },
        },
      });
      break;
    case "Bounce":
      posthog.capture({
        distinctId: n.user.address ?? "unknown",
        event: "postmark_bounce",
        properties: {
          message: MessageID,
          template: n.emailtemplate,
          type: n.type,
          data: req.body as RequestBody,
          props: {
            app: "postmark",
          },
        },
      });
      break;
    case "SpamComplaint":
      posthog.capture({
        distinctId: n.user.address ?? "unknown",
        event: "postmark_spamcomplaint",
        properties: {
          message: MessageID,
          template: n.emailtemplate,
          type: n.type,
          data: req.body as RequestBody,
          props: {
            app: "postmark",
          },
        },
      });
      break;
    case "Open":
      posthog.capture({
        distinctId: n.user.address ?? "unknown",
        event: "postmark_open",
        properties: {
          message: MessageID,
          template: n.emailtemplate,
          type: n.type,
          data: req.body as RequestBody,
          props: {
            app: "postmark",
          },
        },
      });
      break;
    case "Click":
      posthog.capture({
        distinctId: n.user.address ?? "unknown",
        event: "postmark_click",
        properties: {
          message: MessageID,
          template: n.emailtemplate,
          type: n.type,
          data: req.body as RequestBody,
          props: {
            app: "postmark",
          },
        },
      });
      break;
    case "SubscriptionChange":
      posthog.capture({
        distinctId: n.user.address ?? "unknown",
        event: "postmark_subscriptionchange",
        properties: {
          message: MessageID,
          template: n.emailtemplate,
          type: n.type,
          data: req.body as RequestBody,
          props: {
            app: "postmark",
          },
        },
      });
      break;
    default:
      break;
  }

  res.status(200).send("");
}
