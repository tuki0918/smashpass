import type { AtomData } from "@/types/atoms";
import {
  auth,
  onAuthStateChanged,
  provider,
  signInWithPopup,
  signOut,
} from "@/utils/firebase-auth";
import { useRouter } from "@/utils/i18n";
import type { UserInfo } from "firebase/auth";
import { useAtom } from "jotai";
import { atom } from "jotai";
import { useEffect, useState } from "react";

const userAtom = atom<AtomData<UserInfo>>(undefined);

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useAtom(userAtom);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [setUser]);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return { user, login, logout, isLoading };
};
