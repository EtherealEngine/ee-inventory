import axios from 'axios'
import config from '@xrengine/server-core/src/appconfig'

export async function tokenGenerator (): Promise<any> {
  return axios
    .post(`${config.blockchain.blockchainUrl}/authorizeServer`, {
      authSecretKey: config.blockchain.blockchainUrlSecret
    })
}
