"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  cache,
} from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LoginCard from "@/components/LoginCard";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: DatabaseUserAttributes | null;
  loggedIn: boolean;
  isLoading: boolean;
  hasFetched: boolean;
  setShowLoginModal: (bool: boolean) => void;
  loginCheck: () => boolean;
  logout: () => void;
  login: () => void;
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
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchUserData = cache(async () => {
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
    });

    if (!hasFetched) {
      fetchUserData();
    }
  }, []);

  function loginCheck(): boolean {
    if (hasFetched && !loggedIn) {
      setShowLoginModal(true);
      return false;
    }
    return true;
  }

  const router = useRouter();

  function logout() {
    router.replace("/auth/logout");
    setLoggedIn(false);
    setUser(null);
  }

  function login() {
    router.push("/auth/login");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loggedIn,
        isLoading,
        hasFetched,
        setShowLoginModal,
        loginCheck,
        logout,
        login,
      }}
    >
      {children}
      <LoginModal open={showLoginModal} setOpen={setShowLoginModal} />
    </AuthContext.Provider>
  );
};

function LoginModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (bool: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-[50svw]">
        <div className="">
          <LoginCard />
        </div>
      </DialogContent>
    </Dialog>
  );
}
