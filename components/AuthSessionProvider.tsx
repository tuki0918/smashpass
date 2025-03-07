"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "@/utils/i18n";
import type { UserInfo } from "firebase/auth";
import { LoaderCircle } from "lucide-react";
import { createContext, useContext, useEffect } from "react";
import type { FC, PropsWithChildren } from "react";

export const AuthSessionContext = createContext<
  | {
      user: UserInfo | null | undefined;
      login: () => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);

export const AuthSessionProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const { user, isLoading, login, logout } = useAuth();

  useEffect(() => {
    // Redirect to home if user is not logged in
    if (isLoading === false && user === null) {
      router.replace("/");
    }
  }, [router, user, isLoading]);

  return (
    <AuthSessionContext.Provider value={{ user, login, logout }}>
      {isLoading ? <AuthWaitCompleted /> : children}
    </AuthSessionContext.Provider>
  );
};

export const useAuthSession = () => {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error(
      "useAuthSessionContext must be used within an AuthSessionProvider",
    );
  }
  return context;
};

const AuthWaitCompleted: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoaderCircle color="#999999" size={48} className="animate-spin" />
    </div>
  );
};
