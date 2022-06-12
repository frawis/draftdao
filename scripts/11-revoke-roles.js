import sdk from './1-initialize-sdk.js'

const token = sdk.getToken('0x3d7870d269988ECE53611AD1f85DC4F5c74CbebA')

;(async () => {
  try {
    const allRoles = await token.roles.getAll()
    console.log('👀 Roles that exist right now:', allRoles)
    // Revoke all the superpowers your wallet had over the ERC-20 contract.
    await token.roles.setAll({ admin: [], minter: [] })
    console.log('🎉 Roles after revoking ourselves', await token.roles.getAll())
    console.log('✅ Successfully revoked our superpowers from the ERC-20 contract')
  } catch (error) {
    console.error('Failed to revoke ourselves from the DAO trasury', error)
  }
})()
