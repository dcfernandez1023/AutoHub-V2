export type GetUserRequest = {
  id?: string;
  email?: string;
};

export type UserDecodedTokenPayload = {
  userId: string;
  email: string;
  username: string;
  scopes: string;
};
