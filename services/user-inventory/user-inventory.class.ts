import { Service, SequelizeServiceOptions } from 'feathers-sequelize'
import { Application } from '@xrengine/server-core/declarations'
import { NullableId, Params } from '@feathersjs/feathers'
import { tokenGenerator } from '../utils/tokenGenerator'
import { userWalletSend } from '../utils/userWalletSend'
import { UserInventoryInterface } from '../../interfaces/UserInventoryInterfaces'

export type UserInventoryDataType = UserInventoryInterface & { userId: string }

export const transferBIAB = async (fromUserId: string, toUserId: string, quantity: number, walletAmt: number) => {
  let response: any = await tokenGenerator()
  const accessToken = response?.data?.accessToken
  const walletResponse = await userWalletSend(fromUserId, toUserId, walletAmt, accessToken)
  return walletResponse
}

export class UserInventory<T = UserInventoryDataType> extends Service<T> {
  app: Application
  docs: any
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options)
    this.app = app
  }

  // @ts-ignore
  async find(params: Params): Promise<{ data: UserInventoryDataType }> {
    const data = await super.find({ paginate: false })
    console.log(data)
    return { data } as any
  }
}
