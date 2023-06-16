import {Header} from '../components/csr/Header'
import SetupOtherAddress from '../components/csr/SetupOtherAddress'

export default function RootLayout({
                                       children
                                   }: {
    children: React.ReactNode
}) {
    return (
        <div className='bg-[#1E1B20] lg:pl-[92px]'>
            <Header title='Proposals'/>
            <div className='pt-[92px] lg:pt-[192px]'>
                <SetupOtherAddress/>
                <div className='p-5 lg:p-10'>
                    <div className={`flex min-h-screen w-full grow flex-col`}>
                        <div>{children}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
