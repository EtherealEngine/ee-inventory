import { Application } from '@etherealengine/server-core/declarations'
import { InventoryItem } from './inventory-item.class'
import createModel from './inventory-item.model'
import hooks from './inventory-item.hooks'
import inventoryItemDocs from './inventory-item.docs'

declare module '@etherealengine/common/declarations' {
  interface ServiceTypes {
    'inventory-item': InventoryItem
  }
}

export default (app: Application): any => {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true
  }

  const event = new InventoryItem(options, app)
  event.docs = inventoryItemDocs
  app.use('inventory-item', event)

  const service = app.service('inventory-item')
  service.hooks(hooks)
}
