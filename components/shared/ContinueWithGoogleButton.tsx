"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/app/firebase/client";
import { toast } from "sonner";

export default function ContinueWithGoogleButton() {
  const router = useRouter();
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      if (auth.currentUser) {
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
      className=" w-full flex items-center justify-center space-x-2
         bg-rose-600 text-white border border-gray-300 
         hover:bg-rose-400 hover:border-gray-400"
      onClick={handleGoogleLogin}
    >
      <FcGoogle className="h-4 w-4" />
      <span>Continue with Google</span>
    </Button>
  );
}
