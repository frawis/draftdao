import sdk from './1-initialize-sdk.js'

const editionDrop = sdk.getEditionDrop('0xD0344B8e5Fc72F098Ac4bBD2A48E49431006c187')
const token = sdk.getToken('0x3d7870d269988ECE53611AD1f85DC4F5c74CbebA')

;(async () => {
  try {
    const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0)
    if (walletAddresses.length === 0) {
      console.log('No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!')
      process.exit(0)
    }
    const airdropTargets = walletAddresses.map((address) => {
      // Pick a random # between 1000 and 10000.
      const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000)
      console.log('✅ Going to airdrop', randomAmount, 'tokens to', address)

      const airdropTraget = {
        toAddress: address,
        amount: randomAmount,
      }
      return airdropTraget
    })
    // Call transferBatch on all our airdrop targets.
    console.log('🌈 Starting airdrop...')
    await token.transferBatch(airdropTargets)
    console.log('✅ Successfully airdropped tokens to all the holders of the NFT!')
  } catch (error) {
    console.error('Failed to airdrop tokens', error)
  }
})()
