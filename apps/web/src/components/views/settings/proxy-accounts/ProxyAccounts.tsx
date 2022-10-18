import { trpc } from '../../../../utils/trpc'

const ProxyAccounts = () => {
    const proxyAddresses = trpc.useQuery(['user.proxyAddresses'])

    if (!proxyAddresses.data) return <div>Loading</div>

    return (
        <div className="w-full">
            <p>ProxyAccounts</p>

            {proxyAddresses.data.map((proxyAddress) => {
                return <div>{proxyAddress.address}</div>
            })}
        </div>
    )
}

export default ProxyAccounts
