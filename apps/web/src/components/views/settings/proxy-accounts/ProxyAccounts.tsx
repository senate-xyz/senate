import { useState } from 'react'
import { trpc } from '../../../../utils/trpc'

const ProxyAccounts = () => {
    const [newProxyAddress, setNewProxyAddress] = useState('')
    const proxyAddresses = trpc.useQuery(['user.proxyAddresses'])
    const addProxy = trpc.useMutation('user.addProxy')
    const removeProxy = trpc.useMutation('user.removeProxy')
    const utils = trpc.useContext()

    if (!proxyAddresses.data) return <div>Loading</div>

    return (
        <div className="w-full">
            <p>ProxyAccounts</p>

            {proxyAddresses.data.map((proxyAddress) => {
                return (
                    <div className="flex flex-row items-center">
                        {proxyAddress.address}

                        <button
                            onClick={() => {
                                removeProxy.mutate(
                                    { address: proxyAddress.address },
                                    {
                                        onSuccess() {
                                            utils.invalidateQueries()
                                        },
                                    }
                                )
                            }}
                            className="rounded-lg bg-blue-300 p-2 text-center text-sm font-medium"
                        >
                            Delete
                        </button>
                    </div>
                )
            })}

            <div className="border border-gray-300 p-3">
                <label
                    htmlFor="proxyAddress"
                    className="m-2 block text-sm font-medium"
                >
                    Proxy address
                </label>
                <input
                    type="text"
                    id="proxyAddress"
                    className="m-2 block w-full rounded-lg border p-2.5 text-sm"
                    placeholder="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
                    value={newProxyAddress}
                    onChange={(e) => setNewProxyAddress(e.target.value)}
                    required
                />
                <button
                    onClick={() => {
                        addProxy.mutate(
                            { address: newProxyAddress },
                            {
                                onSuccess() {
                                    utils.invalidateQueries()
                                },
                            }
                        )
                    }}
                    type="submit"
                    className="w-full rounded-lg bg-blue-300 px-5 py-2.5 text-center text-sm font-medium"
                >
                    Submit
                </button>
            </div>
        </div>
    )
}

export default ProxyAccounts
