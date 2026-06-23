import { useClerk } from "@clerk/react";

export default function NotFound() {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut({ redirectUrl: "/auth/login" });
  };

  return (
    <>
      <button onClick={handleSignOut}>Sign out</button>
      <div className="w-full min-h-screen">Página no encontrada</div>
    </>
  );
}
