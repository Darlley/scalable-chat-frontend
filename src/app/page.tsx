import LoginModal from "@/components/LoginModal";
import LogoutButton from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/services/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth()

  return (
    <div className="min-h-screen flex flex-col bg-primary items-center justify-center">
      {!session?.user ? (
        <LoginModal />
      ) : (
        <>
          <h1 className="text-white">Olá {session?.user?.name} 👋</h1>

          <div className="flex mt-4">
            <Button asChild variant={"secondary"} className="rounded-r-none" size="sm">
              <Link href="/dashboard">Ir para o dashboard</Link>
            </Button>
            <LogoutButton />
          </div>
        </>
      )}
    </div>
  );
}
