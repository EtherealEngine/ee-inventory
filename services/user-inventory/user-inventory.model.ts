import { Sequelize, DataTypes, Model } from 'sequelize'
import { Application } from '@etherealengine/server-core/declarations'
import { UserInventoryInterface } from '../../interfaces/UserInventoryInterfaces';

export default (app: Application): any => {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const userInventory = sequelizeClient.define<Model<UserInventoryInterface>>(
    'user_inventory',
    {
      userInventoryId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
      },
      addedOn: {
        type: DataTypes.DATE
      }
    },
    {
      hooks: {
        beforeCount(options: any): void {
          options.raw = true
        }
      },
      timestamps: false
    }
  )

  ;(userInventory as any).associate = (models: any): void => {
    ;(userInventory as any).belongsTo(models.inventory_item, { required: true, allowNull: false })
    ;(userInventory as any).belongsTo(models.user, { required: true, allowNull: false })
  }

  return userInventory
}
