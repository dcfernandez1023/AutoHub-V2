export enum CONSTANTS {
  GENERIC_ERROR = 'An unexpected error occurred',
  REGISTRATION_EMAIL_SENT_SUCCESSFULLY = 'Registration email sent successfully',
  AUTOHUB_ACCESS_TOKEN = 'autohubAccessToken',
}

export enum ROLES {
  USER_ROLE = 'USER',
  ADMIN_ROLE = 'ADMIN',
}

export enum AUTH_SCOPES {
  REGISTER = 'register',
  AUTOHUB_READ = 'autohub_read',
  AUTOHUB_WRITE = 'autohub_write',
  AUTOHUB_ADMIN = 'autohub_admin',
}

export const ALLOWED_SCOPES = {
  [ROLES.USER_ROLE]: [AUTH_SCOPES.AUTOHUB_READ, AUTH_SCOPES.AUTOHUB_WRITE, AUTH_SCOPES.REGISTER],
  [ROLES.ADMIN_ROLE]: [
    AUTH_SCOPES.AUTOHUB_READ,
    AUTH_SCOPES.AUTOHUB_WRITE,
    AUTH_SCOPES.REGISTER,
    AUTH_SCOPES.AUTOHUB_ADMIN,
  ],
};
