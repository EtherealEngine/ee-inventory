
import React, { useEffect } from 'react'
import InventoryTradingContents from './InventoryTradingContents'
import styles from
    '@etherealengine/client-core/src/user/components/UserMenu/UserMenu.module.scss'
import {
  TradingAction, TradingService, useTradingState
} from '../services/TradingService'
import { useDispatch } from '@etherealengine/client-core/src/store'
import {
  AuthService, useAuthState
} from '@etherealengine/client-core/src/user/services/AuthService'

interface Props {
  changeActiveMenu?: any
  id: String
}

export const InventoryTrading = (props: Props): any => {
  const tradingState = useTradingState()
  const dispatch = useDispatch()
  let {
    data, user, type, isLoading, isLoadingtransfer, inventory, data1, data0
  } = tradingState.value

  const authState = useAuthState()

  useEffect(() => {
    AuthService.doLoginAuto(true)
  }, [])

  useEffect(() => {
    if (authState.isLoggedIn.value) {
      TradingService.fetchInventoryList(props.id)
      TradingService.fetchfromTradingList(props.id)
      TradingService.fetchtoTradingList(props.id)
      TradingService.fetchUserList(props.id)
    }
  }, [authState.isLoggedIn.value])

  const removeiteminventory = (index) => {
    const inventorytemp = [...inventory]
    inventorytemp.splice(index, 1)
    dispatch(TradingAction.setinventorydata(inventorytemp))
  }

  const removeofferinventory = (index) => {
    const datatemp = [...data0]
    datatemp.splice(index, 1)
    dispatch(TradingAction.fromTradingList(datatemp))
  }
  const removereceiveinventory = (index) => {
    const datatemp = [...data1]
    datatemp.splice(index, 1)
    dispatch(TradingAction.toTradingList(datatemp))
  }

  const additeminventory = (values) => {
    const inventorytemp = [...inventory]
    inventorytemp.push(values)
    dispatch(TradingAction.setinventorydata(inventorytemp))
  }

  const addofferiteminventory = (values) => {
    const datatemp = [...data0]
    datatemp.push(values)
    dispatch(TradingAction.fromTradingList(datatemp))
  }

  const addreceiveiteminventory = (values) => {
    const datatemp = [...data1]
    datatemp.push(values)
    dispatch(TradingAction.toTradingList(datatemp))
  }

  return (
    <div className={styles.menuPanel}>
      {isLoading ? (
        'Loading...'
      ) : (
        <InventoryTradingContents
          data={data}
          data1={data1}
          data0={data0}
          inventory={inventory}
          user={user}
          type={type}
          propid={props.id}
          changeActiveMenu={props.changeActiveMenu}
          removeiteminventory={removeiteminventory}
          removeofferinventory={removeofferinventory}
          removereceiveinventory={removereceiveinventory}
          additeminventory={additeminventory}
          addofferiteminventory={addofferiteminventory}
          addreceiveiteminventory={addreceiveiteminventory}
          handleTransfer={TradingService.handleTransfer}
          acceptOfferSent={TradingService.acceptOfferSent}
          acceptOfferReceived={TradingService.acceptOfferReceived}
          isLoadingtransfer={isLoadingtransfer}
          rejectOfferSent={TradingService.rejectOfferSent}
          rejectOfferReceived={TradingService.rejectOfferReceived}
        />
      )}
    </div>
  )
}

export default InventoryTrading
