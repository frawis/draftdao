import twitterLogo from '../../assets/twitter-logo.svg'
const TWITTER_HANDLE = 'frasty'
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`

const Footer = () => {
  return (
    <footer className="bg-cyan-800">
      <div className="flex items-center justify-between py-2 px-4 lg:mx-auto lg:max-w-4xl">
        <div className="text-sm text-cyan-400">
          <span>&copy; by frasty</span>
        </div>
        <div className="flex items-center space-x-1 text-sm">
          <img alt="Twitter Logo" className="h-8 w-8" src={twitterLogo} />
          <a
            className="block text-sm text-cyan-300 hover:text-cyan-400"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </footer>
  )
}
export default Footer
