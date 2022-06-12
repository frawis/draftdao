import type { Member } from 'components/MemberList/MemberList'
import { shortenAddress } from 'lib/utils'

const MemberListItem = ({ address, tokenAmount }: Member) => {
  return (
    <tr>
      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        {shortenAddress(address)}
      </td>
      <td className="px-3 py-4 text-sm text-gray-500">{tokenAmount}</td>
    </tr>
  )
}
export default MemberListItem
