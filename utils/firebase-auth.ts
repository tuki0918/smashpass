import { auth } from "@/utils/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
