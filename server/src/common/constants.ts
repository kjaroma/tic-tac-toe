export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ErrorMessages = {
  Auth: {
    RegistrationFailure: 'User registration failed', // Do not expose email taken information
    LoginFailure: 'Email or password are incorrect',
    AuthenticationFailed: 'Authentication failed',
    GenericError: 'Something went wrong while registering user',
  },
  Game: {
    CreationFailed: 'Game creation failed',
    UpdateFailed: 'Game update failed',
  },
};
