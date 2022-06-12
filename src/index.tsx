import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

import { ThirdwebProvider, ChainId } from '@thirdweb-dev/react'
const activeChainId = ChainId.Rinkeby

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ThirdwebProvider desiredChainId={activeChainId}>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
)
