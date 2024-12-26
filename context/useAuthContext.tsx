"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AvatarGenerator } from "random-avatar-generator";
import { uploadImage } from "@/app/utils/uploadImage";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore";
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
  getAllUsers: () => Promise<User[]>;
  userId: string | null;
  loading: boolean;
  user: User | null;
}>({
  login: async () => {},
  logout: () => {},
  register: async () => {},
  getUser: async () => null,
  getAllUsers: async () => [],
  userId: null,
  loading: true,
  user: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const firestore = getFirestore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUserId(firebaseUser.uid);
          // Fetch user data when auth state changes
          const userData = await getUser(firebaseUser.uid);
          setUser(userData);
        } else {
          setUserId(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [firestore]);

  const router = useRouter();
  const register = async (values: z.infer<typeof registerSchema>) => {
    try {
      const { userName, email, password, avatar, gender } = values;
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
          gender,
        });
      } else {
        const avatarUrl =
          gender === "male"
            ? "https://cdn-icons-png.flaticon.com/512/4128/4128176.png"
            : "https://cdn-icons-png.flaticon.com/512/6997/6997662.png";

        const docRef = doc(firestore, "users", user.uid);
        await setDoc(docRef, {
          userName,
          email,
          avatarUrl,
          gender,
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
        const userData = await getUser(auth.currentUser.uid);
        setUser(userData);
        toast.success("Login successful");
        router.push("/chat-board");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error((error as Error).message);
    }
  };

  const getUser = async (uid: string) => {
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
        console.log("Mapped users:", currentUser); // Debug log
        return currentUser;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  const getAllUsers = async () => {
    try {
      const usersRef = collection(firestore, "users");
      const snapshot = await getDocs(usersRef);
      const users = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email,
          userName: data.userName,
          avatar: data.avatarUrl,
        };
      });
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users");
      return [];
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
        getAllUsers,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
