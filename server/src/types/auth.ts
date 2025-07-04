export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  baseUrl: string;
  doNotSendEmail?: boolean;
};

export type CompleteRegistrationRequest = {
  userId: string;
  email: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};
