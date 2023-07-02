import { type Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Senate - Proxy Settings",
  icons: "/assets/Senate_Logo/64/Black.svg",
};

export default function Home() {
  redirect("/settings/account");
}
