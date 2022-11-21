import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

const RainbowConnect = () => {
    const router = useRouter()
    useAccount({
        onConnect({ address, isReconnected }) {
            if (!isReconnected) router.push(`/dashboard/daos?user=${address}`)
        },
    })

    return <ConnectButton />
}

export default RainbowConnect
