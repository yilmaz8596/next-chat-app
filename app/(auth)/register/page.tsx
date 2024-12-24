"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "@/app/schemas/registerSchema";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomUpload } from "@/app/components/shared/CustomUpload";
import { AvatarGenerator } from "random-avatar-generator";
import { uploadImage } from "@/app/utils/uploadImage";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { toast } from "sonner";
import { auth } from "@/app/firebase/client";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";

export default function Login() {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: undefined,
    },
  });

  const router = useRouter();
  const firestore = getFirestore();

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    console.log(values);
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

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl text-primary text-center mb-6">
          Welcome to Whispr
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <CustomUpload control={form.control} name="avatar" label="Avatar" />
            <Button type="submit" className="w-full">
              {form.formState.isSubmitting ? "Submitting..." : "Register"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <a
              href="/login"
              className="text-primary hover:underline"
              aria-label="Login"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
