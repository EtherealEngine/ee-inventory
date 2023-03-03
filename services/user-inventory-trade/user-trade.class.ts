import { Service, SequelizeServiceOptions } from 'feathers-sequelize'
import { Application } from '@etherealengine/server-core/declarations'

export class UserTrade extends Service {
  public docs: any
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options)
  }
}
