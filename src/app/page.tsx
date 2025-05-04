import LoginModal from "@/components/LoginModal";
import { Button } from "@/components/ui/button";
import { auth } from "@/services/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth()

  return (
    <div className="min-h-screen flex flex-col bg-primary items-center justify-center">
      {!session?.user ? (
        <LoginModal />
      ) : (
        <Button asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      )}
    </div>
  );
}
