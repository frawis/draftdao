import MemberListItem from 'components/MemberListItem'

export type Member = {
  address: string
  tokenAmount: string
}
export type Members = {
  members: Array<Member>
}
const MemberList = ({ members }: Members) => {
  return (
    <>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-cyan-300">
          <thead className="bg-cyan-600">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-cyan-100 sm:pl-6"
              >
                Address
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-cyan-100">
                Token Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-200 bg-cyan-50">
            {members.map((member) => (
              <MemberListItem
                key={member.address}
                address={member.address}
                tokenAmount={member.tokenAmount}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
export default MemberList
