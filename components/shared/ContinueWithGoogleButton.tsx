"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/app/firebase/client";
import { toast } from "sonner";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const DEFAULT_AVATARS = {
  male: "https://cdn-icons-png.flaticon.com/512/4128/4128176.png",
  female: "https://cdn-icons-png.flaticon.com/512/6997/6997662.png",
  default: "https://cdn-icons-png.flaticon.com/512/847/847969.png", // Neutral default avatar for Google login
};

export default function ContinueWithGoogleButton() {
  const router = useRouter();
  const firestore = getFirestore();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        // Check if user already exists in Firestore
        const userRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          // Save new user to Firestore
          await setDoc(userRef, {
            id: user.uid,
            email: user.email,
            userName: user.displayName,
            avatarUrl: user.photoURL || DEFAULT_AVATARS.default,
            createdAt: new Date(),
          });
        }

        toast.success("Login successful");
        router.push("/chat-board");
      }
    } catch (error) {
      console.error("Error logging in with Google:", error);
      toast.error((error as Error).message);
    }
  };

  return (
    <Button
      className="w-full flex items-center justify-center space-x-2
         bg-rose-600 text-white border border-gray-300 
         hover:bg-rose-400 hover:border-gray-400"
      onClick={handleGoogleLogin}
    >
      <FcGoogle className="h-4 w-4" />
      <span>Continue with Google</span>
    </Button>
  );
}
