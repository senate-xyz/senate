import { Header } from '../components/csr/Header'

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className='pl-[92px]'>
            <Header title='Proposals' />
            <div className='relative bg-[#1E1B20]'>
                <div
                    className={`flex min-h-screen w-full grow flex-col p-10 pt-[210px]`}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}
