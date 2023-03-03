import axios from 'axios'
import config from '@etherealengine/server-core/src/appconfig'

export async function userWalletGenerator (userId, accessToken): Promise<any> {
  return axios.post(
    `${config.blockchain.blockchainUrl}/user-wallet-data`,
    {
      userId: userId
    },
    {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    }
  )
}
