"use client";

import { Fragment, Suspense, useEffect, useState } from "react";
import WalletConnect from "./WalletConnect";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const Header = (props: { title: string }) => {
  const [headerHeight, setHeaderHeight] = useState("lg:h-[192px]");
  const [titleSize, setTitleSize] = useState("lg:text-[78px]");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.scrollY > 0 &&
        document.body.scrollHeight > window.innerHeight + 100
      ) {
        setHeaderHeight("lg:h-[96px]");
        setTitleSize("lg:text-[52px]");
      } else {
        setHeaderHeight("lg:h-[192px]");
        setTitleSize("lg:text-[78px]");
      }
    };

    window.addEventListener("wheel", handleScroll);

    handleScroll();

    return () => window.removeEventListener("wheel", handleScroll);
  }, []);

  return (
    <div
      className={`${headerHeight} fixed z-20 flex h-[96px] w-full items-center justify-start border border-x-0 border-t-0 border-[#545454] bg-black  px-4 transition-all lg:px-10`}
    >
      <Image
        loading="eager"
        priority={true}
        className="lg:hidden"
        src="/assets/Senate_Logo/64/White.svg"
        width={48}
        height={48}
        alt={"Senate logo"}
      />
      <h1
        className={`${titleSize} text-[26px] font-extrabold text-white transition`}
      >
        {props.title}
      </h1>

      <div className="flex w-full justify-end text-white lg:hidden">
        <Menu as="div">
          <div>
            <Menu.Button>
              <Image
                loading="eager"
                priority={true}
                src="/assets/Icon/MobileMenuOpen.svg"
                width={48}
                height={48}
                alt={"Senate logo"}
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-250"
            enterFrom="transform opacity-0 translate-y-[-1000px]"
            enterTo="transform opacity-100 translate-y-[0px]"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 top-0 h-screen w-screen bg-black p-2 text-[26px] font-extrabold leading-[60px] text-white transition">
              <div className="flex flex-row justify-between">
                <Menu.Item>
                  {({}) => (
                    <a href="/orgs">
                      <Image
                        loading="eager"
                        priority={true}
                        src="/assets/Icon/MobileLogo.svg"
                        width={188}
                        height={48}
                        alt={"Senate logo"}
                      />
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ close }) => (
                    <a onClick={close}>
                      <Image
                        loading="eager"
                        priority={true}
                        src="/assets/Icon/MobileMenuClose.svg"
                        width={48}
                        height={48}
                        alt={"Senate logo"}
                      />
                    </a>
                  )}
                </Menu.Item>
              </div>

              <Menu.Item>
                {({ active }) => (
                  <div className="relative flex flex-row items-center pl-6 pt-8">
                    {pathname?.includes("orgs") ? (
                      <Image
                        loading="eager"
                        priority={true}
                        src="/assets/Icon/DAOs/Active.svg"
                        width={48}
                        height={48}
                        alt={"Senate logo"}
                      />
                    ) : (
                      <Image
                        loading="eager"
                        priority={true}
                        src="/assets/Icon/DAOs/Inactive.svg"
                        width={48}
                        height={48}
                        alt={"Senate logo"}
                      />
                    )}
                    <a
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      className={`${active && "w-full"}`}
                      href="/orgs"
                    >
                      Orgs
                    </a>
                  </div>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <div className="relative flex flex-row items-center pl-6 pt-8">
                    {pathname?.includes("proposals") ? (
                      <Image
                        loading="eager"
                        priority={true}
                        src="/assets/Icon/Proposals/Active.svg"
                        width={48}
                        height={48}
                        alt={"Senate logo"}
                      />
                    ) : (
                      <Image
                        loading="eager"
                        priority={true}
                        src="/assets/Icon/Proposals/Inactive.svg"
                        width={48}
                        height={48}
                        alt={"Senate logo"}
                      />
                    )}
                    <a
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      className={`${active && "w-full"}`}
                      href="/proposals/active"
                    >
                      Proposals
                    </a>
                  </div>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <div className="relative flex flex-row items-center pl-6 pt-8">
                    {pathname?.includes("settings") ? (
                      <Image
                        loading="eager"
                        priority={true}
                        src="/assets/Icon/Settings/Active.svg"
                        width={48}
                        height={48}
                        alt={"Senate logo"}
                      />
                    ) : (
                      <Image
                        loading="eager"
                        priority={true}
                        src="/assets/Icon/Settings/Inactive.svg"
                        width={48}
                        height={48}
                        alt={"Senate logo"}
                      />
                    )}
                    <a
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      className={`${active && "w-full"}`}
                      href="/settings/account"
                    >
                      Settings
                    </a>
                  </div>
                )}
              </Menu.Item>

              <div className="flex w-full justify-center pt-8 text-[18px] font-normal">
                <Menu.Item>
                  <Suspense fallback={<></>}>
                    <WalletConnect />
                  </Suspense>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <div className="hidden justify-end pr-20 lg:flex lg:w-full">
        <Suspense fallback={<></>}>
          <WalletConnect />
        </Suspense>
      </div>
    </div>
  );
};
