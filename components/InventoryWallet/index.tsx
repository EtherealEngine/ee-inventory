import React, { useEffect } from 'react'
import WalletContents from './WalletContents'
import styles from '@etherealengine/client-core/src/user/components/UserMenu/UserMenu.module.scss'
import { useWalletState, WalletService } from '../services/WalletService'
import { AuthService, useAuthState } from '@etherealengine/client-core/src/user/services/AuthService'

interface Props {
  changeActiveMenu?: any
  id: String
}
export function InventoryWallet (props: Props): any {
  const WalletState = useWalletState()
  let {
    data, user, type, coinlimit, isLoading, dataReceive, isLoadingtransfer,
    coinData, coinDataReceive
  } = WalletState.value

  const authState = useAuthState()

  useEffect(() => {
    AuthService.doLoginAuto(true)
  }, [])

  useEffect(() => {
    if (authState.isLoggedIn.value) {
      WalletService.fetchInventoryList(props.id)
      WalletService.fetchUserList(props.id)
    }
  }, [authState.isLoggedIn.value])

  return (
    <div className={styles.menuPanel}>
      {isLoading ? (
        'Loading...'
      ) : (
        <WalletContents
          user={user}
          ids={props.id}
          coinlimit={coinlimit}
          getreceiverid={WalletService.getreceiverid}
          sendamtsender={WalletService.sendamtsender}
          sendamtreceiver={WalletService.sendamtreceiver}
          changeActiveMenu={props.changeActiveMenu}
          dataReceive={dataReceive}
          data={data}
        />
      )}
    </div>
  )
}

export default InventoryWallet
