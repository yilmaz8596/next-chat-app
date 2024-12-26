import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { auth } from "@/app/firebase/client";

export default function LogoutButton() {
  const router = useRouter();
  const logout = async () => {
    try {
      await auth.signOut();
      router.push("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out");
    }
  };
  return (
    <Button
      onClick={logout}
      variant="outline"
      className="max-w-sm 
        bg-primary text-primary-foreground hover:bg-rose-500 hover:text-primary-hover
      "
    >
      Logout
    </Button>
  );
}
