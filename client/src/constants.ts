export const Urls = {
  LOGIN: `${process.env.REACT_APP_API_URL}/api/users/login`,
  REGISTER: `${process.env.REACT_APP_API_URL}/api/users/register`,
  CREATE_GAME: `${process.env.REACT_APP_API_URL}/api/games/create`,
  PLAY_GAME: `${process.env.REACT_APP_WS_URL}/api/games/play`,
} as const

export const AUTH_COOKIE_NAME = 'access_token' as const

export const AppRoutes = {
  LOGIN: 'login',
  REGISTER: 'register',
  GAME: 'game',
  HISTORY: 'history',
} as const