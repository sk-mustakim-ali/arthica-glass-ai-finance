import { createContext } from "react";

export interface DemoUser {
  id: string;
  uid: string;
  displayName: string;
  email: string;
}

export interface AuthContextType {
  user: DemoUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});
