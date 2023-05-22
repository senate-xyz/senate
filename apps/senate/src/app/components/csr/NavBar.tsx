'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export const NavBar = () => {
    const pathname = usePathname()
    return !pathname?.includes('verify') ? (
        <div className='flex min-h-screen min-w-[92px] flex-col items-center border border-y-0 border-l-0 border-[#545454] bg-black'>
            <Link href='/' className='my-[4rem]'>
                <Image
                    loading='eager'
                    priority={true}
                    src='/assets/Senate_Logo/64/White.svg'
                    width={64}
                    height={64}
                    alt={'Senate logo'}
                />
            </Link>

            <div className='flex flex-col gap-5'>
                <Link href={`/daos`}>
                    {pathname?.includes('daos') ? (
                        <div className='flex flex-col items-center'>
                            <Image
                                loading='eager'
                                priority={true}
                                src='/assets/Icon/DAOs/Active.svg'
                                width={64}
                                height={64}
                                alt={'active daos button'}
                            />
                            <p className='text-[13px] text-white'>DAOs</p>
                        </div>
                    ) : (
                        <div className='flex flex-col items-center'>
                            <Image
                                loading='eager'
                                priority={true}
                                src='/assets/Icon/DAOs/Inactive.svg'
                                width={64}
                                height={64}
                                alt={'inactive daos button'}
                            />
                            <p className='text-[13px] text-gray-600'>DAOs</p>
                        </div>
                    )}
                </Link>

                <Link
                    href={`/proposals/active?from=any&end=365&voted=any&proxy=any`}
                >
                    {pathname?.includes('proposals') ? (
                        <div className='flex flex-col items-center'>
                            <Image
                                loading='eager'
                                priority={true}
                                src='/assets/Icon/Proposals/Active.svg'
                                width={64}
                                height={64}
                                alt={'active proposals button'}
                            />
                            <p className='text-[13px] text-white'>Proposals</p>
                        </div>
                    ) : (
                        <div className='flex flex-col items-center'>
                            <Image
                                loading='eager'
                                priority={true}
                                src='/assets/Icon/Proposals/Inactive.svg'
                                width={64}
                                height={64}
                                alt={'inactive proposals button'}
                            />
                            <p className='text-[13px] text-gray-600'>
                                Proposals
                            </p>
                        </div>
                    )}
                </Link>

                <Link href={`/settings/account`}>
                    {pathname?.includes('settings') ? (
                        <div className='flex flex-col items-center'>
                            <Image
                                loading='eager'
                                priority={true}
                                src='/assets/Icon/Settings/Active.svg'
                                width={64}
                                height={64}
                                alt={'active settings button'}
                            />
                            <p className='text-[13px] text-white'>Settings</p>
                        </div>
                    ) : (
                        <div className='flex flex-col items-center'>
                            <Image
                                loading='eager'
                                priority={true}
                                src='/assets/Icon/Settings/Inactive.svg'
                                width={64}
                                height={64}
                                alt={'inactive settings button'}
                            />
                            <p className='text-[13px] text-gray-600'>
                                Settings
                            </p>
                        </div>
                    )}
                </Link>
            </div>

            <div className='flex grow flex-row items-end justify-between justify-self-end pb-2 opacity-50'>
                <Link href='https://twitter.com/SenateLabs'>
                    <Image
                        loading='eager'
                        priority={true}
                        src='/assets/Icon/Twitter.svg'
                        alt='twitter'
                        width={24}
                        height={24}
                    />
                </Link>

                <Link href='https://discord.gg/shtxfNqazd'>
                    <Image
                        loading='eager'
                        priority={true}
                        src='/assets/Icon/DiscordWhite.svg'
                        alt='twitter'
                        width={24}
                        height={24}
                    />
                </Link>

                <Link href='https://github.com/senate-xyz/senate'>
                    <Image
                        loading='eager'
                        priority={true}
                        src='/assets/Icon/Github.svg'
                        alt='twitter'
                        width={24}
                        height={24}
                    />
                </Link>
            </div>
        </div>
    ) : (
        <></>
    )
}
