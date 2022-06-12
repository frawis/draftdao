import sdk from './1-initialize-sdk.js'
;(async () => {
  try {
    const voteContractAddress = await sdk.deployer.deployVote({
      name: 'My Drafties DAO',
      voting_token_address: '0x3d7870d269988ECE53611AD1f85DC4F5c74CbebA',
      voting_delay_in_blocks: 0,
      voting_period_in_blocks: 45992, // 1 day = 6570 blocks - 1 week = 45992 blocks
      // The minimum % of the total supply that need to vote for
      // the proposal to be valid after the time for the proposal has ended.
      voting_quorum_fraction: 0,
      // What's the minimum # of tokens a user needs to be allowed to create a proposal?
      // I set it to 0. Meaning no tokens are required for a user to be allowed to
      // create a proposal.
      proposal_token_threshold: 0,
    })
    console.log('✅ Successfully deployed vote contract, address:', voteContractAddress)
  } catch (error) {
    console.error('Failed to deploy vote contract: ', error)
  }
})()
