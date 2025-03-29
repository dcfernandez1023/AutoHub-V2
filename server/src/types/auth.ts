export type RegisterRequest = {
  email: string;
  password: string;
  baseUrl: string;
};

export type CompleteRegistrationRequest = {
  userId: string;
  email: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};
