'use client'

import { Fragment, useState } from 'react'
import WalletConnect from './WalletConnect'
import { GiHamburgerMenu } from 'react-icons/gi'
import { Menu, Transition } from '@headlessui/react'

export const Header = (props: { title: string }) => {
    const [headerHeight, setHeaderHeight] = useState('h-[192px]')
    const [titleSize, setTitleSize] = useState('text-[78px]')

    if (typeof window != 'undefined')
        window.addEventListener('wheel', () => {
            if (
                window.scrollY > 0 &&
                document.body.scrollHeight > window.innerHeight + 100
            ) {
                setHeaderHeight('h-[96px]')
                setTitleSize('text-[52px]')
            } else {
                setHeaderHeight('h-[192px]')
                setTitleSize('text-[78px]')
            }
        })

    return (
        <div
            className={`lg:${headerHeight} fixed z-20 flex h-[96px] w-full items-center justify-between border border-x-0 border-t-0 border-[#545454] bg-black px-10 transition-all`}
        >
            <h1
                className={`lg:${titleSize} text-[52px] font-extrabold text-white transition`}
            >
                {props.title}
            </h1>

            <div className='left-4 flex text-white lg:hidden'>
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
                            <div className='p-1 '>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            className={`${active && 'w-full'}`}
                                            href='/daos'
                                        >
                                            DAOs
                                        </a>
                                    )}
                                </Menu.Item>
                            </div>
                            <div className='p-1'>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            className={`${active && 'w-full'}`}
                                            href='/proposals/active'
                                        >
                                            Proposals
                                        </a>
                                    )}
                                </Menu.Item>
                            </div>
                            <div className='p-1'>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            className={`${active && 'w-full'}`}
                                            href='/settings/account'
                                        >
                                            Account settings
                                        </a>
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
