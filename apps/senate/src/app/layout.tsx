/* eslint-disable @next/next/no-page-custom-font */
import "@rainbow-me/rainbowkit/styles.css";

import "../styles/globals.css";
import { NavBar } from "./components/csr/NavBar";
import RootProvider from "./providers";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Senate ",
  icons: "/assets/Senate_Logo/64/Black.svg",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#1E1B20]">
      <body>
        <RootProvider>
          <div className="h-full min-h-screen w-full">
            <div className="z-10 flex h-full min-h-screen w-full flex-row">
              <div className="fixed hidden lg:flex">
                <NavBar />
              </div>

              <div className="w-full">{children}</div>
            </div>
          </div>
        </RootProvider>
      </body>
    </html>
  );
}
