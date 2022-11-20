'use client'

import { useState } from 'react'
import { trpc } from '../../../../client/trpcClient'

const VoterAddresses = () => {
    const [newProxyAddress, setNewProxyAddress] = useState('')

    const voters = trpc.user.voters.voters.useQuery()
    const addVoter = trpc.user.voters.addVoter.useMutation()
    const removeVoter = trpc.user.voters.removeVoter.useMutation()
    const utils = trpc.useContext()

    const [error, setError] = useState('')
    if (!voters.data) return <div>Loading</div>

    return (
        <div className="w-full">
            <div>VoterAddresses</div>

            {voters.data.map((voter) => {
                return (
                    <div
                        key={voter.address}
                        className="flex flex-row items-center"
                    >
                        {voter.address}

                        <button
                            onClick={() => {
                                removeVoter.mutate(
                                    { address: voter.address },
                                    {
                                        onError(e) {
                                            setError(e.message)
                                        },
                                        onSuccess() {
                                            utils.invalidate()
                                            setError('')
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
                    Voter address
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
                        addVoter.mutate(
                            { address: newProxyAddress },
                            {
                                onError(e) {
                                    setError(e.message)
                                },
                                onSuccess() {
                                    utils.invalidate()
                                    setError('')
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
            <div>
                <pre>{error}</pre>
            </div>
        </div>
    )
}

export default VoterAddresses
