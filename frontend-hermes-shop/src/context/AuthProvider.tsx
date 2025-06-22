import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import { refreshToken } from '~/services/auth';

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: Dispatch<SetStateAction<string | null>>;
  loading: boolean;
};

const initial: AuthContextType = { accessToken: null, setAccessToken: () => {}, loading: true };
const AuthContext = createContext<AuthContextType>(initial);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshToken()
      .then((data) => {
        if (data instanceof Error) return;
        setAccessToken(data.accessToken);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return <AuthContext.Provider value={{ accessToken, setAccessToken, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
