import sdk from './1-initialize-sdk.js'
import { MaxInt256 } from '@ethersproject/constants'

const editionDrop = sdk.getEditionDrop('0xD0344B8e5Fc72F098Ac4bBD2A48E49431006c187')

;(async () => {
  try {
    const claimConditions = [
      {
        startTime: new Date(),
        maxQuantity: 50_000,
        price: 0,
        quantityLimitPerTransaction: 1,
        waitInSeconds: MaxInt256,
      },
    ]

    await editionDrop.claimConditions.set('0', claimConditions)
    console.log('✅ Successfully set claim condition!')
  } catch (error) {
    console.error('🛑 Failed to set claim condition! ', error)
  }
})()
