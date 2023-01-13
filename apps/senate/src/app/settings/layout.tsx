import { RainbowConnect } from '../components/csr/RainbowConnect'

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className='w-full pl-[92px]'>
            <div
                className={`fixed z-10 flex h-[192px] w-full items-center justify-between border border-x-0 border-t-0 border-[#545454] bg-black px-10 transition-all`}
            >
                <h1
                    className={`text-[78px] font-extrabold text-white transition`}
                >
                    Settings
                </h1>
                <div className='pr-20'>
                    <RainbowConnect />
                </div>
            </div>
            <div
                className={`flex min-h-screen w-full grow flex-col pt-[192px]`}
            >
                {children}
            </div>
        </div>
    )
}
