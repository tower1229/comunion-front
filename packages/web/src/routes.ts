export const layoutGroupedRoutes = {
  'empty/index': ['/ipfs/raw/*'],
  'auth/index': ['/auth/login', '/auth/callback/*', '/auth/register/*'],
  // 'fullpage/index': ['/builder'],
  'profile/index': ['/profile/*']
  // default: ['*']
} as const

export const morePath = {
  '/auth/login': {
    name: 'invite',
    path: '/invite'
  }
} as const
