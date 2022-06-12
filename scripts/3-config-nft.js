import sdk from './1-initialize-sdk.js'
import { readFileSync } from 'fs'

const editionDrop = sdk.getEditionDrop('0xD0344B8e5Fc72F098Ac4bBD2A48E49431006c187')

;(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: 'NBA Teams Cap',
        description: 'This NFT will give you access to DraftDAO!',
        image: readFileSync('scripts/assets/nbadraft-1.gif'),
      },
    ])
    console.log('✅ Successfully created a new NFT in the drop!')
  } catch (error) {
    console.error('🛑 failed to create the new NFT! ', error)
  }
})()
