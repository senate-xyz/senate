import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Senate - Verification",
  icons: "/assets/Senate_Logo/64/Black.svg",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#1E1B20] lg:pl-[92px]">{children}</div>
  );
}
