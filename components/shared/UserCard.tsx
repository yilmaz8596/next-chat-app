import { User } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function UserCard({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.userName}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{user.email}</CardDescription>
      </CardContent>
      <CardFooter>
        <CardDescription>
          <Image
            src={user.avatar}
            alt={user.userName}
            width={40}
            height={40}
            className="rounded-full"
          />
        </CardDescription>
      </CardFooter>
    </Card>
  );
}
