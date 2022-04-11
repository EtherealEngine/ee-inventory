import { HotbarMenu, UserMenuPanels } from
    '@xrengine/client-core/src/user/components/UserMenu'
import InventoryContents from './InventoryContents'
import InventoryTrading from './InventoryTrading'
import InventoryWallet from './InventoryWallet'
import InventoryIcon from '@mui/icons-material/Inventory'

const InventoryPanels = {
  InventoryContents: 'Inventory',
  InventoryTrading: 'Trading',
  InventoryWallet: 'Wallet',
}

UserMenuPanels.set(InventoryPanels.InventoryContents, InventoryContents)
UserMenuPanels.set(InventoryPanels.InventoryTrading, InventoryTrading)
UserMenuPanels.set(InventoryPanels.InventoryWallet, InventoryWallet)

HotbarMenu.set(InventoryPanels.InventoryContents, InventoryIcon)

export default () => null!
