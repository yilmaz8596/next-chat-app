import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/client";

export default function LogoutButton() {
  return (
    <Button
      onClick={() => signOut(auth)}
      variant="outline"
      className="max-w-sm 
        bg-primary text-primary-foreground hover:bg-rose-500 hover:text-primary-hover
      "
    >
      Logout
    </Button>
  );
}
