import axios from 'axios'
import config from '@etherealengine/server-core/src/appconfig'

export async function userWalletSend (fromUserId, toUserId, walletAmt, accessToken): Promise<any> {
  return axios.post(
    `${config.blockchain.blockchainUrl}/user-wallet-data/send`,
    {
      fromUserId: fromUserId,
      toUserId: toUserId,
      amount: walletAmt
    },
    {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    }
  )
}
