import { Header } from '../components/csr/Header'
import SetupOtherAddress from '../components/csr/SetupOtherAddress'

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
                    className={`flex min-h-screen w-full grow flex-col pt-[192px]`}
                >
                    <SetupOtherAddress />
                    <div className={`p-10`}>{children}</div>
                </div>
            </div>
        </div>
    )
}
