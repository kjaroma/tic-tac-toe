export const URLS = {
  login: `${process.env.REACT_APP_API_URL}/api/users/login`,
  register: `${process.env.REACT_APP_API_URL}/api/users/register`,
  createGame: `${process.env.REACT_APP_API_URL}/api/games/create`,
  joinGame: `${process.env.REACT_APP_WS_URL}/api/games/`,
  gameLobby: `${process.env.REACT_APP_WS_URL}/api/games/lobby`
} as const
