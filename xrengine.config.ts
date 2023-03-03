import type { ProjectConfigInterface } from '@etherealengine/projects/ProjectConfigInterface'

const config: ProjectConfigInterface = {
  onEvent: undefined,
  thumbnail: '/static/etherealengine_thumbnail.jpg',
  routes: {
    '/inventory': { component: () => import('./components/InventoryContents') },
    '/trading': { component: () => import('./components/InventoryTrading') },
    '/wallet': { component: () => import('./components/InventoryWallet') }
  },
  webappInjection: () => import('./components/webappInjection'),
  services: './services/services.ts',
  databaseSeed: undefined
}

export default config
