import sdk from './1-initialize-sdk.js'

const vote = sdk.getVote('0xDCA8b7712017023e094Bd9a43795b1dC42239506')
const token = sdk.getToken('0x3d7870d269988ECE53611AD1f85DC4F5c74CbebA')

;(async () => {
  try {
    await token.roles.grant('minter', vote.getAddress())
    console.log('✅ Successfully gave vote contract permissions to act on token contract')
  } catch (error) {
    console.error('failed to grant vote contract permissions on token contract', error)
    process.exit(1)
  }

  try {
    const ownedTokenBalance = await token.balanceOf(process.env.WALLET_ADDRESS)
    const ownedAmount = ownedTokenBalance.displayValue
    const percent90 = (Number(ownedAmount) / 100) * 90
    // Transfer 90% of the supply to our voting contract
    await token.transfer(vote.getAddress(), percent90)
    console.log('✅ Successfully transferred ' + percent90 + ' tokens to vote contract')
  } catch (error) {
    console.error('failed to transfer tokens to vote contract', error)
  }
})()
