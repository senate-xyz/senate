import Link from 'next/link'
import { TfiLayoutPlaceholder } from 'react-icons/tfi'

export default function NavBar() {
    return (
        <div className="grid w-24 items-start bg-slate-900">
            <div className="flex flex-col items-center">
                <Link href="/">
                    <TfiLayoutPlaceholder
                        size="64"
                        className="my-12 fill-slate-600"
                    />
                </Link>

                <Link href={`/dashboard/daos`}>
                    <div className="flex flex-col items-center">
                        <TfiLayoutPlaceholder
                            className="fill-slate-400"
                            size="64"
                        />
                        <p className="text-sm text-slate-400">DAOs</p>
                    </div>
                </Link>

                <Link href={`/dashboard/proposals/active`}>
                    <div className="flex flex-col items-center">
                        <TfiLayoutPlaceholder
                            className="fill-slate-400"
                            size="64"
                        />
                        <p className="text-sm text-slate-400">Proposals</p>
                    </div>
                </Link>

                <Link href={`/dashboard/settings`}>
                    <div className="flex flex-col items-center">
                        <TfiLayoutPlaceholder
                            className="fill-slate-400"
                            size="64"
                        />
                        <p className="text-sm text-slate-400">Settings</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}
