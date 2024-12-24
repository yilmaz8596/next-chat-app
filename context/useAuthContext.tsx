"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AvatarGenerator } from "random-avatar-generator";
import { uploadImage } from "@/app/utils/uploadImage";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/app/firebase/client";
import { registerSchema } from "@/app/schemas/registerSchema";
import { loginSchema } from "@/app/schemas/loginSchema";
import { z } from "zod";

interface User {
  id: string;
  email: string;
  userName: string;
  avatar: string;
}
const AuthContext = createContext<{
  login: (values: z.infer<typeof loginSchema>) => Promise<void>;
  logout: () => void;
  register: (values: z.infer<typeof registerSchema>) => Promise<void>;
  getUser: (uid: string) => Promise<User | null>;
  userId: string | null;
  loading: boolean;
}>({
  login: async () => {},
  logout: () => {},
  register: async () => {},
  getUser: async () => null,
  userId: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const firestore = getFirestore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore]);

  const router = useRouter();
  const register = async (values: z.infer<typeof registerSchema>) => {
    try {
      const { userName, email, password, avatar } = values;
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        toast.error("User already exists with this email");
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (avatar) {
        const avatarUrl = await uploadImage(avatar, `avatars/${user.uid}`);
        const docRef = doc(firestore, "users", user.uid);
        await setDoc(docRef, {
          userName,
          email,
          avatarUrl,
        });
      } else {
        const generator = new AvatarGenerator();
        const avatarUrl = generator.generateRandomAvatar();
        const docRef = doc(firestore, "users", user.uid);
        await setDoc(docRef, {
          userName,
          email,
          avatarUrl,
        });
      }
      router.push("/login");
      toast.success("Account created successfully");
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("Error creating account");
    }
  };

  const login = async (values: z.infer<typeof loginSchema>) => {
    try {
      const { email, password } = values;
      await signInWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        setUserId(auth.currentUser.uid);
        toast.success("Login successful");
        router.push("/chat-board");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error((error as Error).message);
    }
  };

  const getUser = async (uid: string) => {
    if (loading || !uid) return null;
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const currentUser = {
          id: docSnap.id,
          userName: data.userName,
          email: data.email,
          avatar: data.avatarUrl,
        };
        return currentUser;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout: () => {},
        register,
        getUser,
        userId,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
