'use client'

import { Fragment, useEffect, useState } from 'react'
import WalletConnect from './WalletConnect'
import { GiHamburgerMenu } from 'react-icons/gi'
import { Menu, Transition } from '@headlessui/react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export const Header = (props: { title: string }) => {
    const [headerHeight, setHeaderHeight] = useState('lg:h-[192px]')
    const [titleSize, setTitleSize] = useState('lg:text-[78px]')
    const pathname = usePathname()

    if (typeof window != 'undefined') {
        window.addEventListener('wheel', () => {
            if (
                window.scrollY > 0 &&
                document.body.scrollHeight > window.innerHeight + 100
            ) {
                setHeaderHeight('lg:h-[96px]')
                setTitleSize('lg:text-[52px]')
            } else {
                setHeaderHeight('lg:h-[192px]')
                setTitleSize('lg:text-[78px]')
            }
        })
    }

    useEffect(() => {
        if (
            window.scrollY > 0 &&
            document.body.scrollHeight > window.innerHeight + 100
        ) {
            setHeaderHeight('lg:h-[96px]')
            setTitleSize('lg:text-[52px]')
        } else {
            setHeaderHeight('lg:h-[192px]')
            setTitleSize('lg:text-[78px]')
        }
    }, [])

    return (
        <div
            className={`${headerHeight} fixed z-20 flex h-[96px] w-full items-center justify-between border border-x-0 border-t-0 border-[#545454] bg-black  px-4 transition-all lg:px-10`}
        >
            <h1
                className={`${titleSize} text-[52px] font-extrabold text-white transition`}
            >
                {props.title}
            </h1>

            <div className='flex justify-self-end text-white lg:hidden'>
                <Menu as='div'>
                    <div>
                        <Menu.Button>
                            <GiHamburgerMenu size={24} />
                        </Menu.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        enter='transition ease-out duration-250'
                        enterFrom='transform opacity-0 translate-y-[-1000px]'
                        enterTo='transform opacity-100 translate-y-[0px]'
                        leave='transition ease-in duration-75'
                        leaveFrom='transform opacity-100 scale-100'
                        leaveTo='transform opacity-0 scale-95'
                    >
                        <Menu.Items className='absolute left-0 top-0 h-screen w-screen gap-4 divide-y divide-white bg-black p-4 text-[52px] font-extrabold text-white transition'>
                            <div className='flex flex-row justify-between pb-4'>
                                <Menu.Item>
                                    {({}) => (
                                        <a href='/daos'>
                                            <Image
                                                src='/assets/Senate_Logo/64/White.svg'
                                                width={64}
                                                height={64}
                                                alt={'Senate logo'}
                                            />
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ close }) => (
                                        <a onClick={close}>
                                            <Image
                                                src='/assets/Icon/Close.svg'
                                                width={64}
                                                height={64}
                                                alt={'Senate logo'}
                                            />
                                        </a>
                                    )}
                                </Menu.Item>
                            </div>

                            <div className='p-1 '>
                                <Menu.Item>
                                    {({ active }) => (
                                        <div className='flex flex-row'>
                                            {pathname?.includes('daos') ? (
                                                <Image
                                                    src='/assets/Icon/DAOs/Active.svg'
                                                    width={64}
                                                    height={64}
                                                    alt={'Senate logo'}
                                                />
                                            ) : (
                                                <Image
                                                    src='/assets/Icon/DAOs/Inactive.svg'
                                                    width={64}
                                                    height={64}
                                                    alt={'Senate logo'}
                                                />
                                            )}
                                            <a
                                                className={`${
                                                    active && 'w-full'
                                                }`}
                                                href='/daos'
                                            >
                                                DAOs
                                            </a>
                                        </div>
                                    )}
                                </Menu.Item>
                            </div>
                            <div className='p-1'>
                                <Menu.Item>
                                    {({ active }) => (
                                        <div className='flex flex-row'>
                                            {pathname?.includes('proposals') ? (
                                                <Image
                                                    src='/assets/Icon/Proposals/Active.svg'
                                                    width={64}
                                                    height={64}
                                                    alt={'Senate logo'}
                                                />
                                            ) : (
                                                <Image
                                                    src='/assets/Icon/Proposals/Inactive.svg'
                                                    width={64}
                                                    height={64}
                                                    alt={'Senate logo'}
                                                />
                                            )}
                                            <a
                                                className={`${
                                                    active && 'w-full'
                                                }`}
                                                href='/proposals/active'
                                            >
                                                Proposals
                                            </a>
                                        </div>
                                    )}
                                </Menu.Item>
                            </div>
                            <div className='p-1'>
                                <Menu.Item>
                                    {({ active }) => (
                                        <div className='flex flex-row'>
                                            {pathname?.includes('settings') ? (
                                                <Image
                                                    src='/assets/Icon/Settings/Active.svg'
                                                    width={64}
                                                    height={64}
                                                    alt={'Senate logo'}
                                                />
                                            ) : (
                                                <Image
                                                    src='/assets/Icon/Settings/Inactive.svg'
                                                    width={64}
                                                    height={64}
                                                    alt={'Senate logo'}
                                                />
                                            )}
                                            <a
                                                className={`${
                                                    active && 'w-full'
                                                }`}
                                                href='/settings/account'
                                            >
                                                Settings
                                            </a>
                                        </div>
                                    )}
                                </Menu.Item>
                            </div>
                            <div className='flex w-full justify-center pt-4 text-[18px] font-normal'>
                                <Menu.Item>
                                    <WalletConnect />
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>

            <div className='hidden pr-20 lg:flex'>
                <WalletConnect />
            </div>
        </div>
    )
}
