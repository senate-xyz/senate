'use client'

import NotConnected from './components/csr/NotConnected'
import UserAddress from './components/csr/UserAddress'
import UserEmail from './components/csr/UserEmail'

export default function Home() {
    return (
        <main>
            <div className='mt-2 flex flex-col gap-12'>
                <NotConnected />
                <UserAddress />
                <UserEmail />
            </div>
        </main>
    )
}
