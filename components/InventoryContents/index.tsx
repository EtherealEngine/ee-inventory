import { AuthService, useAuthState } from
  '@etherealengine/client-core/src/user/services/AuthService'
import React, { useEffect } from 'react'
import InventoryContents from './InventoryContents'
import styles from
  '@etherealengine/client-core/src/user/components/UserMenu/UserMenu.module.scss'
import { InventoryService, useInventoryState } from '../services/InventoryService'

interface Props {
  changeActiveMenu?: any
  id: String
}

export const Inventory = (props: Props): any => {
  const inventoryState = useInventoryState()
  let { isLoading } = inventoryState.value
  const authState = useAuthState()

  useEffect(() => {
    AuthService.doLoginAuto(true)
  }, [])

  useEffect(() => {
    if (authState.isLoggedIn.value) {
      InventoryService.fetchInventoryList(
        authState.authUser.identityProvider.userId.value
      )
    }
  }, [authState.isLoggedIn.value])

  return (
    <div className={styles.menuPanel}>
      {isLoading ? (
        'Loading...'
      ) : (
        <InventoryContents
          id={props.id}
          changeActiveMenu={props.changeActiveMenu}
        />
      )}
    </div>
  )
}

export default Inventory
