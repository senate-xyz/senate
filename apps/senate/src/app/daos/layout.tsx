import { Header } from '../components/csr/Header'

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className='lg:pl-[92px]'>
            <Header title='DAOs' />
            <div className='relative bg-[#1E1B20] p-5 lg:p-10'>
                <div
                    className={`flex min-h-screen w-full grow flex-col pt-[92px] lg:pt-[192px]`}
                >
                    <div className='flex grow flex-col'>{children}</div>
                </div>
            </div>
        </div>
    )
}
