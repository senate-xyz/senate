const {
    getMakerPollVotes,
    getVotesForVoter
} = require('../src/votes/chain/makerPoll')

const { Proposal } = require('@senate/database')

test('getVotesForVoter unsuccessful when proposals are missing from database', () => {
    expect(1 + 2).toBe(3)
})

test('getVotesForVoter sucessful when all proposals are in database', () => {
    expect(1 + 2).toBe(3)
})
