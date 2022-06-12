import React, { useState, useEffect, useMemo } from 'react'
import { useAddress, useMetamask, useEditionDrop, useToken } from '@thirdweb-dev/react'
import Button from 'components/Button'
import Spinner from 'components/Spinner'
import Container from 'components/Container'
import type { TokenHolderBalance } from '@thirdweb-dev/sdk'
import MemberList from 'components/MemberList'

function App() {
  const address = useAddress()
  const connectWithMetamask = useMetamask()
  console.log('👋 Address:', address)

  const editionDrop = useEditionDrop('0xD0344B8e5Fc72F098Ac4bBD2A48E49431006c187')
  const token = useToken('0x3d7870d269988ECE53611AD1f85DC4F5c74CbebA')
  const [hasClaimedNFT, setHasClaimedNFT] = useState<boolean>(false)
  const [isClaiming, setIsClaiming] = useState<boolean>(false)
  // Holds the amount of token each member has in state.
  const [memberTokenAmounts, setMemberTokenAmounts] = useState<TokenHolderBalance[] | undefined>([])
  // The array holding all of our members addresses.
  const [memberAddresses, setMemberAddresses] = useState<string[] | undefined>([])

  // This useEffect grabs all the addresses of our members holding our NFT
  useEffect(() => {
    if (!hasClaimedNFT) {
      return
    }
    const getAllAddresses = async () => {
      try {
        const memberAddresses = await editionDrop?.history.getAllClaimerAddresses(0)
        setMemberAddresses(memberAddresses)
        console.log('🚀 Members addresses', memberAddresses)
      } catch (error) {
        console.error('failed to get member list', error)
      }
    }
    getAllAddresses()
  }, [hasClaimedNFT, editionDrop?.history])

  // This useEffect grabs the $ token of each member holds.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token?.history.getAllHolderBalances()
        setMemberTokenAmounts(amounts)
        console.log('👜 Amounts', amounts)
      } catch (error) {
        console.error('failed to get member balances', error)
      }
    }
    getAllBalances()
  }, [hasClaimedNFT, token?.history])

  // combine memberAddresses and membersTokenAmounts
  const memberList = useMemo(() => {
    return memberAddresses?.map((address) => {
      const member = memberTokenAmounts?.find(({ holder }) => holder === address)
      return {
        address,
        tokenAmount: member?.balance.displayValue || '0',
      }
    })
  }, [memberAddresses, memberTokenAmounts])

  console.log(memberList)

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
        <div className="mt-4 lg:mt-8">
          <h1 className="text-5xl font-extrabold lg:text-6xl">
            🏀{' '}
            <span className="bg-gradient-to-r from-cyan-700 to-teal-400 bg-clip-text text-transparent">
              DraftDAO Member Page
            </span>
          </h1>
        </div>
        <p className="mt-16 text-center text-lg text-cyan-700">
          🎊 Congratulations on being a member
        </p>
        <div className="mt-4 lg:mt-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold text-cyan-900">Member List</h2>
              <div className="mt-4">
                {/* @ts-ignore */}
                <MemberList members={memberList} />
              </div>
            </div>
            <div className="lg:col-span-1"></div>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col content-center items-center justify-center px-2">
      <h1 className="text-center text-5xl font-extrabold lg:text-7xl">
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
