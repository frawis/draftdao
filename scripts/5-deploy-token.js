import sdk from './1-initialize-sdk.js'
import { AddressZero } from '@ethersproject/constants'
;(async () => {
  try {
    const tokenAddress = await sdk.deployer.deployToken({
      name: 'DraftDAO Governance Token',
      symbol: 'DRAFTIES',
      primary_sale_recipient: AddressZero,
    })
    console.log('✅ Successfully deployed token module, address:', tokenAddress)
  } catch (error) {
    console.error('failed to deploy token module', error)
  }
})()
