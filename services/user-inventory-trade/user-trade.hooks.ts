import { disallow } from 'feathers-hooks-common'
import { HookContext } from '@feathersjs/feathers'

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
    ],
    update: [disallow()],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      (context: HookContext): HookContext => {
        try {
          for (let x = 0; x < context.result.data.length; x++) {
            let data = [...JSON.parse(context.result.data[x].fromUserInventoryIds)]
            context.result.data[x].fromUserInventoryIds = data
          }
        } catch {
          context.result.data[0].fromUserInventoryIds = []
        }
        try {
          for (let x = 0; x < context.result.data.length; x++) {
            let data = [...JSON.parse(context.result.data[x].toUserInventoryIds)]
            context.result.data[x].toUserInventoryIds = data
          }
        } catch {
          context.result.data[0].toUserInventoryIds = []
        }
        return context
      }
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
} as any
