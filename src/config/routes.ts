export const ROUTES = {
  PUBLIC: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  USER: {
    CHAT: '/chat',
    PROFILE: '/profile',
  },
  PREMIUM: {
    ADVANCED_CHAT: '/advanced-chat',
    PERSONALITY_CUSTOMIZATION: '/customize',
  },
  ADMIN: {
    DASHBOARD: '/admin',
    USER_MANAGEMENT: '/admin/users',
  }
} as const;

export const ROUTE_ROLES = {
  [ROUTES.USER.CHAT]: ['USER', 'PREMIUM_USER', 'ADMIN'],
  [ROUTES.PREMIUM.ADVANCED_CHAT]: ['PREMIUM_USER', 'ADMIN'],
  [ROUTES.ADMIN.DASHBOARD]: ['ADMIN'],
} as const; 