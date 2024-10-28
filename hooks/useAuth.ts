import { userAtom } from "@/utils/atoms";
import {
	auth,
	provider,
	signInWithPopup,
	signOut,
} from "@/utils/firebase-auth";
import { useAtom } from "jotai";

export const useAuth = () => {
	const [user, setUser] = useAtom(userAtom);
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
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	return { user, login, logout };
};
