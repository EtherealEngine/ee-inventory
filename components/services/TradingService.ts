import { createState, useState } from '@speigg/hookstate'
import { client } from '@etherealengine/client-core/src/feathers'
import { store, useDispatch } from '@etherealengine/client-core/src/store'

const state = createState({
  data: [] as Array<any>,
  data1: [] as Array<any>,
  data0: [] as Array<any>,
  inventory: [] as Array<any>,
  user: [] as Array<any>,
  type: [] as Array<any>,
  isLoading: true,
  isLoadingTransfer: false
})

store.receptors.push((action: TradingActionType): void => {
  state.batch((s) => {
    switch (action.type) {
      case 'SET_INVENTORY_DATA':
        return s.merge({
          inventory: [...action.data]
        })
      case 'SET_USER_DATA':
        return s.merge({
          user: [...action.user]
        })
      case 'FROM_TRADE_LIST':
        return s.merge({
          data0: [...action.ftradearr]
        })
      case 'TO_TRADE_LIST':
        return s.merge({
          data1: [...action.ttradearr]
        })

      case 'LOAD_TRANSFER':
        return s.merge({ isLoadingTransfer: true })
      case 'STOP_LOAD_TRANSFER':
        return s.merge({ isLoadingTransfer: false })
      case 'LOAD_INVENTORY':
        return s.merge({ isLoading: true })
      case 'STOP_LOAD_INVENTORY':
        return s.merge({ isLoading: false })
    }
  }, action.type)
})

export const accessTradingState = () => state
export const useTradingState = () => useState(state) as any as typeof state as unknown as typeof state

export const TradingService = {
  handleTransfer: async (ids, items, fromid) => {
    const dispatch = useDispatch()
    dispatch(TradingAction.loadtransfer())
    const data = {
      fromUserId: fromid,
      toUserId: ids,
      fromUserInventoryIds: [...items],
      fromUserStatus: 'REQUEST',
      toUserStatus: 'REQUEST'
    }

    try {
      const response = await client.service('user-trade').create(data)
      if (response) {
        TradingService.fetchInventoryList(fromid)
        TradingService.fetchfromTradingList(fromid)
        TradingService.fetchtoTradingList(fromid)
      }
    } catch (err) {
      console.error(err, 'error')
    } finally {
      dispatch(TradingAction.stoploadtransfer())
    }
  },

  fetchInventoryList: async (id) => {
    const dispatch = useDispatch()
    dispatch(TradingAction.loadinventory())
    try {
      const response = await client.service('user').get(id)
      let arr = [
        ...response.inventory_items.filter((val) => val.isCoin === false)
      ]
      dispatch(TradingAction.setinventorydata(arr))
    } catch (err) {
      console.error(err, 'error')
    } finally {
      dispatch(TradingAction.stoploadinventory())
    }
  },

  fetchUserList: async (id) => {
    const dispatch = useDispatch()
    try {
      const response = await client.service('inventory-item').find({
        query: {
          isCoin: true
        }
      })
      const resp = response?.data[0]
      const prevData = [...resp?.users]
      if (response.data && response.data.length !== 0) {
        const activeUser = prevData.filter(
          (val: any) => val.inviteCode !== null && val.id !== id
        )

        dispatch(TradingAction.setuserdata(activeUser))
      }
    } catch (err) {
      console.error(err, 'error')
    }
  },

  fetchfromTradingList: async (id) => {
    const dispatch = useDispatch()
    dispatch(TradingAction.loadinventory())
    try {
      const response = await client.service('user-trade')
        .find({ query: { fromUserId: id } })
      dispatch(TradingAction.fromTradingList(response.data))
    } catch (err) {
      console.error(err, 'error')
    } finally {
      dispatch(TradingAction.stoploadinventory())
    }
  },

  fetchtoTradingList: async (id) => {
    const dispatch = useDispatch()
    dispatch(TradingAction.loadinventory())
    try {
      const response = await client.service('user-trade')
        .find({ query: { toUserId: id } })
      dispatch(TradingAction.toTradingList(response.data))
    } catch (err) {
      console.error(err, 'error')
    } finally {
      dispatch(TradingAction.stoploadinventory())
    }
  },

  rejectOfferReceived: async (tradeId, items, id) => {
    const dispatch = useDispatch()
    dispatch(TradingAction.loadtransfer())
    try {
      const data = {
        toUserStatus: 'REJECT'
      }
      const response = await client.service('user-trade').patch(tradeId, data)
      if (response) {
        TradingService.fetchInventoryList(id)
        TradingService.fetchfromTradingList(id)
        TradingService.fetchtoTradingList(id)
      }
    } catch (err) {
      console.error(err, 'error')
    } finally {
      dispatch(TradingAction.stoploadtransfer())
      localStorage.removeItem('tradeId')
    }
  },

  rejectOfferSent: async (tradeId, items, id) => {
    const dispatch = useDispatch()
    dispatch(TradingAction.loadtransfer())
    try {
      const data = {
        fromUserStatus: 'REJECT'
      }
      const response = await client.service('user-trade').patch(tradeId, data)
      if (response) {
        TradingService.fetchInventoryList(id)
        TradingService.fetchfromTradingList(id)
        TradingService.fetchtoTradingList(id)
      }
    } catch (err) {
      console.error(err, 'error')
    } finally {
      dispatch(TradingAction.stoploadtransfer())
      localStorage.removeItem('tradeId')
    }
  },

  acceptOfferReceived: async (tradeId, items, id) => {
    const dispatch = useDispatch()
    dispatch(TradingAction.loadtransfer())

    try {
      const data = {
        toUserInventoryIds: items,
        toUserStatus: 'ACCEPT'
      }
      const response = await client.service('user-trade').patch(tradeId, data)
      if (response) {
        TradingService.fetchInventoryList(id)
        TradingService.fetchfromTradingList(id)
        TradingService.fetchtoTradingList(id)
      }
    } catch (err) {
      console.error(err, 'error')
    } finally {
      dispatch(TradingAction.stoploadtransfer())
      localStorage.removeItem('tradeId')
    }
  },

  acceptOfferSent: async (tradeId, items, id) => {
    const dispatch = useDispatch()
    dispatch(TradingAction.loadtransfer())

    try {
      const data = {
        fromUserInventoryIds: items,
        fromUserStatus: 'ACCEPT'
      }
      const response = await client.service('user-trade').patch(tradeId, data)
      if (response) {
        TradingService.fetchInventoryList(id)
        TradingService.fetchfromTradingList(id)
        TradingService.fetchtoTradingList(id)
      }
    } catch (err) {
      console.error(err, 'error')
    } finally {
      dispatch(TradingAction.stoploadtransfer())
      localStorage.removeItem('tradeId')
    }
  }
}

//Action
export const TradingAction = {
  loadtransfer: () => {
    return {
      type: 'LOAD_TRANSFER' as const
    }
  },
  stoploadtransfer: () => {
    return {
      type: 'STOP_LOAD_TRANSFER' as const
    }
  },
  loadinventory: () => {
    return {
      type: 'LOAD_INVENTORY' as const
    }
  },
  stoploadinventory: () => {
    return {
      type: 'STOP_LOAD_INVENTORY' as const
    }
  },
  setinventorydata: (arr) => {
    return {
      type: 'SET_INVENTORY_DATA' as const,
      data: [...arr]
    }
  },
  setuserdata: (userarr) => {
    return {
      type: 'SET_USER_DATA' as const,
      user: [...userarr]
    }
  },
  fromTradingList: (fromtradearr) => {
    return {
      type: 'FROM_TRADE_LIST' as const,
      ftradearr: [...fromtradearr]
    }
  },
  toTradingList: (totradearr) => {
    return {
      type: 'TO_TRADE_LIST' as const,
      ttradearr: [...totradearr]
    }
  }
}

export type TradingActionType = ReturnType<typeof TradingAction[keyof typeof TradingAction]>
