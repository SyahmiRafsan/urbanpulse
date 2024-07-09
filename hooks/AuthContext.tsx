"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  user: DatabaseUserAttributes | null;
  loggedIn: boolean;
  isLoading: boolean;
  hasFetched: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<DatabaseUserAttributes | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUser(data);
        setLoggedIn(!!data);
      } catch (error) {
        console.log(error);
        setUser(null);
        setLoggedIn(false);
        setHasFetched(true);
      } finally {
        setIsLoading(false);
        setHasFetched(true);
      }
    };

    if (!hasFetched) {
      fetchUserData();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loggedIn, isLoading, hasFetched }}>
      {children}
    </AuthContext.Provider>
  );
};
