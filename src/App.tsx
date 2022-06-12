import React, { useState, useEffect, useMemo } from 'react'
import {
  useAddress,
  useMetamask,
  useEditionDrop,
  useToken,
  useVote,
  useNetwork,
} from '@thirdweb-dev/react'
import { AddressZero } from '@ethersproject/constants'
import type { TokenHolderBalance, Proposal } from '@thirdweb-dev/sdk'
import { ChainId } from '@thirdweb-dev/sdk'

import Button from 'components/Button'
import Spinner from 'components/Spinner'
import Container from 'components/Container'

import MemberList from 'components/MemberList'

function App() {
  const address = useAddress()
  const network = useNetwork()
  const connectWithMetamask = useMetamask()
  console.log('👋 Address:', address)

  const editionDrop = useEditionDrop('0xD0344B8e5Fc72F098Ac4bBD2A48E49431006c187')
  const token = useToken('0x3d7870d269988ECE53611AD1f85DC4F5c74CbebA')
  const vote = useVote('0xDCA8b7712017023e094Bd9a43795b1dC42239506')
  const [hasClaimedNFT, setHasClaimedNFT] = useState<boolean>(false)
  const [isClaiming, setIsClaiming] = useState<boolean>(false)
  // Holds the amount of token each member has in state.
  const [memberTokenAmounts, setMemberTokenAmounts] = useState<TokenHolderBalance[] | undefined>([])
  // The array holding all of our members addresses.
  const [memberAddresses, setMemberAddresses] = useState<string[] | undefined>([])

  const [proposals, setProposals] = useState<Proposal[] | undefined>([])
  const [isVoting, setIsVoting] = useState<boolean>(false)
  const [hasVoted, setHasVoted] = useState<boolean>(false)

  // Retrieve all our existing proposals from the contract.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return
    }
    // A simple call to vote.getAll() to grab the proposals.
    const getAllProposals = async () => {
      try {
        const proposals = await vote?.getAll()
        setProposals(proposals)
        console.log('🌈 Proposals:', proposals)
      } catch (error) {
        console.log('failed to get proposals', error)
      }
    }
    getAllProposals()
  }, [hasClaimedNFT, vote])

  // We also need to check if the user already voted.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return
    }

    // If we haven't finished retrieving the proposals from the useEffect above
    // then we can't check if the user voted yet!
    if (!proposals?.length) {
      return
    }

    const checkIfUserHasVoted = async () => {
      try {
        // @ts-ignore
        const hasVoted = await vote?.hasVoted(proposals[0].proposalId, address)
        // @ts-ignore
        setHasVoted(hasVoted)
        if (hasVoted) {
          console.log('🥵 User has already voted')
        } else {
          console.log('🙂 User has not voted yet')
        }
      } catch (error) {
        console.error('Failed to check if wallet has voted', error)
      }
    }
    checkIfUserHasVoted()
  }, [hasClaimedNFT, proposals, address, vote])

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

  console.log(network[0])
  // @ts-ignore
  if (address && network?.[0].data.chain.id !== ChainId.Rinkeby) {
    return (
      <div className="mx-auto mt-4 w-full max-w-md rounded-md border-pink-300 bg-pink-100 p-4 lg:p-6">
        <h2 className="text-3xl font-extrabold text-pink-900">Please connect to Rinkeby</h2>
        <p className="mt-2 text-pink-800">
          This dapp only works on the Rinkeby network, please switch networks in your connected
          wallet.
        </p>
      </div>
    )
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
          <div className="md:grid md:grid-cols-2 md:gap-6 lg:gap-12">
            <div className="md:col-span-1">
              <h2 className="text-xl font-semibold text-cyan-900">Member List</h2>
              <div className="mt-4">
                {/* @ts-ignore */}
                <MemberList members={memberList} />
              </div>
            </div>
            <div className="md:col-span-1">
              <h2 className="text-xl font-semibold text-cyan-900">Active Proposals</h2>
              <div className="mt-4">
                <form
                  className="space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // before we do async things
                    setIsVoting(true)

                    const votes = proposals?.map((proposal) => {
                      const voteResult = {
                        proposalId: proposal.proposalId,
                        // abstain by default
                        vote: 2,
                      }
                      proposal.votes.forEach((vote) => {
                        const elem = document.getElementById(proposal.proposalId + '-' + vote.type)
                        // @ts-ignore
                        if (elem?.checked) {
                          voteResult.vote = vote.type
                          return
                        }
                      })
                      return voteResult
                    })

                    // first we need to make sure the user delegates their token to vote
                    try {
                      //we'll check if the wallet still needs to delegate their tokens before they can vote
                      const delegation = await token?.getDelegationOf(address)
                      // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                      if (delegation === AddressZero) {
                        await token?.delegateTo(address)
                      }
                      // then we need to vote on the proposals
                      try {
                        await Promise.all(
                          //@ts-ignore
                          votes?.map(async ({ proposalId, vote: _vote }) => {
                            // before voting we first need to check whether the proposal is open for voting
                            // we first need to get the latest state of the proposal
                            const proposal = await vote?.get(proposalId)
                            // then we check if the proposal is open for voting (state === 1 means it is open)
                            if (proposal?.state === 1) {
                              // if it is open for voting, we'll vote on it
                              //@ts-ignore
                              return vote?.vote(proposalId, _vote)
                            }
                            // if the proposal is not open for voting we just return nothing, letting us continue
                            return
                          })
                        )
                        try {
                          // if any of the propsals are ready to be executed we'll need to execute them
                          // a proposal is ready to be executed if it is in state 4
                          await Promise.all(
                            //@ts-ignore
                            votes.map(async ({ proposalId }) => {
                              // we'll first get the latest state of the proposal again, since we may have just voted before
                              const proposal = await vote?.get(proposalId)

                              //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                              if (proposal?.state === 4) {
                                //@ts-ignore
                                return vote?.execute(proposalId)
                              }
                            })
                          )
                          // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                          setHasVoted(true)
                          // and log out a success message
                          console.log('successfully voted')
                        } catch (error) {
                          console.error('failed to execute votes', error)
                        }
                      } catch (error) {
                        console.error('failed to vote', error)
                      }
                    } catch (error) {
                      console.error('failed to delegate tokens')
                    } finally {
                      // in *either* case we need to set the isVoting state to false to enable the button again
                      setIsVoting(false)
                    }
                  }}
                >
                  {proposals &&
                    proposals.map((proposal) => {
                      return (
                        <div
                          // @ts-ignore
                          key={proposal.proposalId}
                          className="flex flex-col overflow-hidden rounded-lg shadow-lg"
                        >
                          <div className="rounded bg-cyan-50 p-4">
                            <div className="font-medium text-cyan-800">{proposal.description}</div>
                            <div className="mt-2 flex items-center justify-between">
                              {proposal.votes.map(({ type, label }) => (
                                <div key={type} className="flex items-center">
                                  <input
                                    type="radio"
                                    id={proposal.proposalId + '-' + type}
                                    // @ts-ignore
                                    name={proposal.proposalId}
                                    value={type}
                                    //default the "abstain" vote to checked
                                    defaultChecked={type === 2}
                                    className="h-4 w-4 border-cyan-300 text-pink-600 focus:ring-pink-500"
                                  />
                                  <label
                                    className="ml-3 block text-sm font-medium text-gray-700"
                                    htmlFor={proposal.proposalId + '-' + type}
                                  >
                                    {label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  <Button disabled={isVoting || hasVoted} submit={true} block={true}>
                    {isVoting ? 'Voting...' : hasVoted ? 'You Already Voted' : 'Submit Votes'}
                  </Button>
                  {!hasVoted && (
                    <div className="text-center text-xs text-cyan-800">
                      This will trigger multiple transactions that you will need to sign.
                    </div>
                  )}
                </form>
              </div>
            </div>
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
