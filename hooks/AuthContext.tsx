"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginCard from "@/components/LoginCard";

interface AuthContextType {
  user: DatabaseUserAttributes | null;
  loggedIn: boolean;
  isLoading: boolean;
  hasFetched: boolean;
  setShowLoginModal: (bool: boolean) => void;
  loginCheck: () => boolean;
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

  function loginCheck(): boolean {
    if (hasFetched && !loggedIn) {
      setShowLoginModal(true);
      return false;
    }
    return true;
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
