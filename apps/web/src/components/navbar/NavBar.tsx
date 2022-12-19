import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Script from 'next/script'

export default function NavBar() {
    const router = useRouter()

    return (
        <div className="flex min-w-[92px] flex-col items-center border border-y-0 border-l-0 border-[#545454] bg-black">
            <Script id="howuku">
                {`(function(t,r,a,c,k){
                c=['track','identify','converted'],t.o=t._init||{},
                c.map(function(n){return t.o[n]=t.o[n]||function(){(t.o[n].q=t.o[n].q||[]).push(arguments);};}),t._init=t.o,
                k=r.createElement("script"),k.type="text/javascript",k.async=true,k.src="https://cdn.howuku.com/js/track.js",k.setAttribute("key",a),
                r.getElementsByTagName("head")[0].appendChild(k);
                })(window, document, "9mv6yAGkYDZV0BJEzlN34O");`}
            </Script>
            <Script src="https://api.buildbetter.app/v1/widget/index.js" />
            <Script id="feedback">
                {`function start() {
                if (
                    window.hasOwnProperty("BuildBetter") &&
                    typeof window.BuildBetter.FeedbackWidget.init === "function"
                ) {
                    window.BuildBetter.FeedbackWidget.init({
                    token: "2a9153b8-a377-4245-8204-40451f8f876d",
                    });
                }
                window.clearInterval(interval);
                }
                var interval = window.setInterval(start, 1000);`}
            </Script>

            <Link href="/" className="mt-10 mb-20">
                <Image
                    src="/assets/Senate_Logo/64/White.svg"
                    width={64}
                    height={64}
                    alt={'Senate logo'}
                />
            </Link>

            <div className="flex flex-col gap-5">
                <Link href={`/daos`}>
                    {router.asPath.includes('daos') ? (
                        <div className="flex flex-col items-center">
                            <Image
                                src="/assets/Icon/DAOs/Active.svg"
                                width={64}
                                height={64}
                                alt={'active daos button'}
                            />
                            <p className="text-[13px] text-white">DAOs</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Image
                                src="/assets/Icon/DAOs/Inactive.svg"
                                width={64}
                                height={64}
                                alt={'inactive daos button'}
                            />
                            <p className="text-[13px] text-gray-600">DAOs</p>
                        </div>
                    )}
                </Link>

                <Link href={`/proposals/active`}>
                    {router.asPath.includes('proposals') ? (
                        <div className="flex flex-col items-center">
                            <Image
                                src="/assets/Icon/Proposals/Active.svg"
                                width={64}
                                height={64}
                                alt={'active proposals button'}
                            />
                            <p className="text-[13px] text-white">Proposals</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Image
                                src="/assets/Icon/Proposals/Inactive.svg"
                                width={64}
                                height={64}
                                alt={'inactive proposals button'}
                            />
                            <p className="text-[13px] text-gray-600">
                                Proposals
                            </p>
                        </div>
                    )}
                </Link>

                <Link href={`/settings/account`}>
                    {router.asPath.includes('settings') ? (
                        <div className="flex flex-col items-center">
                            <Image
                                src="/assets/Icon/Settings/Active.svg"
                                width={64}
                                height={64}
                                alt={'active settings button'}
                            />
                            <p className="text-[13px] text-white">Settings</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Image
                                src="/assets/Icon/Settings/Inactive.svg"
                                width={64}
                                height={64}
                                alt={'inactive settings button'}
                            />
                            <p className="text-[13px] text-gray-600">
                                Settings
                            </p>
                        </div>
                    )}
                </Link>
            </div>
            <div className="flex h-full flex-col items-center justify-end gap-2">
                <div className="flex flex-row items-end justify-between pb-16 opacity-50">
                    <Image
                        src="/assets/Icon/Twitter.svg"
                        alt="twitter"
                        width={24}
                        height={24}
                    />

                    <Link href="https://github.com/senate-xyz/senate">
                        <Image
                            src="/assets/Icon/Github.svg"
                            alt="twitter"
                            width={24}
                            height={24}
                        />
                    </Link>
                    <Link href="https://discord.gg/bxCCkwtP">
                        <Image
                            src="/assets/Icon/DiscordWhite.svg"
                            alt="twitter"
                            width={24}
                            height={24}
                        />
                    </Link>
                </div>
            </div>
        </div>
    )
}
