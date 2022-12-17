import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
    return (
        <div className="flex w-full justify-between">
            <div className="m-2">
                <a href="https://dev-senate-web.onrender.com/">
                    <div className="flex items-center justify-start">
                        <Image
                            width={50}
                            height={50}
                            src="/logo_dark.svg"
                            alt="very cool logo"
                        />
                        <p>Senate</p>
                    </div>
                </a>
            </div>
            <div className="m-3 flex gap-3">
                <a href="/about">
                    <p>About</p>
                </a>
                <a href="/faq">
                    <p>FAQ</p>
                </a>
                <a href="https://twitter.com/SenateLabs">
                    <p>Twitter</p>
                </a>
                <a href="https://github.com/senate-xyz/senate">
                    <p>Github</p>
                </a>
                <a href="https://discord.gg/pX7JNetz">
                    <p>Discord</p>
                </a>
            </div>
        </div>
    )
}

const Mid = () => {
    return (
        <div className="flex justify-between gap-4">
            <div className="flex w-full flex-col items-center">
                <div className="flex flex-col">
                    <p>Join</p>
                    <p>Senate!</p>
                </div>
                <p className="m-4 w-96">
                    Start receiving notifications from your DAOs every time a
                    new proposal is made!
                </p>

                <div className="content-center justify-center">
                    <button className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700">
                        <Link href="/dashboard/daos">
                            <p>Launch App</p>
                        </Link>
                    </button>
                </div>
            </div>

            <div>
                <Image
                    width="500"
                    height="500"
                    src="/homeart.svg"
                    alt="very cool graphics"
                />
            </div>
        </div>
    )
}

const Footer = () => {
    return <div></div>
}

const Home: NextPage = () => {
    return (
        <div>
            <Header />
            <Mid />
            <Footer />
        </div>
    )
}

export default Home
