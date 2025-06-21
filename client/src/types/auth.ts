export type AuthContextType = {
  userId: string;
  email: string;
  scopes: string[];
};

export type AuthContextData = {
  authContext?: AuthContextType;
  setAuthContext: (authContext: AuthContextType | undefined) => void;
  loading: boolean;
};
