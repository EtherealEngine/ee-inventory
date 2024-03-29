import { createState, useState } from '@speigg/hookstate'
import { store, useDispatch } from '@etherealengine/client-core/src/store'
import { client } from '@etherealengine/client-core/src/feathers'
import { UserId } from '@etherealengine/common/src/interfaces/UserId'

const state = createState({
  data: [] as Array<any>,
  user: [] as Array<any>,
  isLoading: false,
  isLoadingtransfer: false
})

store.receptors.push((action: InventoryActionType): void => {
  state.batch((s) => {
    switch (action.type) {
      case 'SET_INVENTORY_DATA':
        return s.merge({
          data: action.data,
        })
      case 'LOAD_TRANSFER':
        return s.merge({ isLoadingtransfer: true })
      case 'STOP_LOAD_TRANSFER':
        return s.merge({ isLoadingtransfer: false })
      case 'LOAD_INVENTORY':
        return s.merge({ isLoading: true })
      case 'STOP_LOAD_INVENTORY':
        return s.merge({ isLoading: false })
    }
  }, action.type)
})

export const accessInventoryState = () => state
export const useInventoryState = () => useState(state) as any as typeof state as unknown as typeof state

//Service
export const InventoryService = {
  handleTransfer: async (ids, itemid, inventoryid) => {
    const dispatch = useDispatch()
    dispatch(InventoryAction.loadTransfer())
    try {
      const response = await client.service('user-inventory').patch({
        userId: ids,
        userInventoryId: itemid
      })
      InventoryService.fetchInventoryList(inventoryid)
    } catch (err) {
      console.error(err, 'error')
    } finally {
      dispatch(InventoryAction.stopLoadTransfer())
    }
  },

  fetchInventoryList: async (userId: UserId) => {
    const dispatch = useDispatch()
    try {
      const response = await client.service('user-inventory').find({
        query: {
          paginate: false,
          userId
        }
      })
      console.log(response)
    } catch (err) {
      console.error(err, 'error')
    }
  }
}

//Action
export const InventoryAction = {
  loadTransfer: () => {
    return {
      type: 'LOAD_TRANSFER' as const
    }
  },
  stopLoadTransfer: () => {
    return {
      type: 'STOP_LOAD_TRANSFER' as const
    }
  },
  loadInventory: () => {
    return {
      type: 'LOAD_INVENTORY' as const
    }
  },
  stopLoadInventory: () => {
    return {
      type: 'STOP_LOAD_INVENTORY' as const
    }
  },
  setInventoryData: (data) => {
    return {
      type: 'SET_INVENTORY_DATA' as const,
      data
    }
  }
}

export type InventoryActionType = ReturnType<typeof InventoryAction[keyof typeof InventoryAction]>
