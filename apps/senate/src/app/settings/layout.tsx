import { Header } from '../components/csr/Header'

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className='lg:pl-[92px]'>
            <Header title='Settings' />
            <div className='bg-[#1E1B20]'>
                <div
                    className={`flex min-h-screen w-full grow flex-col pt-[192px]`}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}
