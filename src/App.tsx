import React, { useState, useEffect } from 'react'
import { useAddress, useMetamask, useEditionDrop } from '@thirdweb-dev/react'
import Button from 'components/Button'
import Spinner from 'components/Spinner'
import Container from 'components/Container'

function App() {
  const address = useAddress()
  const connectWithMetamask = useMetamask()
  console.log('👋 Address:', address)

  const editionDrop = useEditionDrop('0xD0344B8e5Fc72F098Ac4bBD2A48E49431006c187')
  const [hasClaimedNFT, setHasClaimedNFT] = useState<boolean>(false)
  const [isClaiming, setIsClaiming] = useState<boolean>(false)

  useEffect(() => {
    if (!address) {
      return
    }
    const checkBalance = async () => {
      try {
        const balance = await editionDrop?.balanceOf(address, 0)
        if (balance?.gt(0)) {
          setHasClaimedNFT(true)
          console.log('🌟 this user has a membership NFT!')
        } else {
          setHasClaimedNFT(false)
          console.log("😭 this user doesn't have a membership NFT.")
        }
      } catch (error) {
        setHasClaimedNFT(false)
        console.error('Failed to get balance. ', error)
      }
    }
    checkBalance()
  }, [address, editionDrop])

  const mintNft = async () => {
    try {
      setIsClaiming(true)
      await editionDrop?.claim('0', 1)
      console.log(
        `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop?.getAddress()}/0`
      )
      setHasClaimedNFT(true)
    } catch (error) {
      setHasClaimedNFT(false)
      console.error('Failed to mint NFT', error)
    } finally {
      setIsClaiming(false)
    }
  }

  if (!address) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col content-center items-center justify-center px-2">
        <h1 className="text-5xl font-extrabold lg:text-7xl">Welcome to DraftDAO</h1>
        <div className="mt-8">
          <button
            className="rounded-[3rem] border-0 bg-black px-8 py-5 text-xl font-bold uppercase text-white"
            onClick={connectWithMetamask}
          >
            Connect your Wallet
          </button>
        </div>
      </div>
    )
  }

  if (hasClaimedNFT) {
    return (
      <Container>
        <h1 className="text-5xl font-extrabold lg:text-6xl">🏀 DraftDAO Member Page</h1>
        <p>🎊 Congratulations on being a member</p>
      </Container>
    )
  }
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col content-center items-center justify-center px-2">
      <h1 className="text-5xl font-extrabold text-center lg:text-7xl">
        Mint your free
        <span className="block">
          🏀{' '}
          <span className="bg-gradient-to-r from-cyan-700 to-teal-400 bg-clip-text text-transparent">
            DrafterDAO
          </span>
        </span>{' '}
        Membership NFT
      </h1>
      <div className="mt-8">
        <Button size="lg" block={true} disabled={isClaiming} onClick={mintNft}>
          {isClaiming ? (
            <div className="flex items-center space-x-2">
              <Spinner color="#ffffff" className="h-6" />
              <span className="animate-pulse">Minting...</span>
            </div>
          ) : (
            'Mint your nft (FREE)'
          )}
        </Button>
      </div>
    </div>
  )
}

export default App
