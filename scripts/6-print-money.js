import sdk from './1-initialize-sdk.js'

const token = sdk.getToken('0x3d7870d269988ECE53611AD1f85DC4F5c74CbebA')

;(async () => {
  try {
    // What's the max supply you want to set? 1,000,000 is a nice number!
    const amount = 1000000
    // Interact with your deployed ERC-20 contract and mint the tokens!
    await token.mintToSelf(amount)
    const totalSupply = await token.totalSupply()

    // Print out how many of our token's are out there now!
    console.log('✅ There now is', totalSupply.displayValue, '$DRAFTIES in circulation')
  } catch (error) {
    console.error('Failed to print money', error)
  }
})()
