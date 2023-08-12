import { redirect } from "next/navigation";

// const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
//   host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
//   disableGeoip: true,
// });

export default function Home() {
  redirect("/proposals/active");
}
