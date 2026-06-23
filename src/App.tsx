import { useClerk } from "@clerk/react";

export default function App() {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut({ redirectUrl: "/auth/login" });
  };
  return <button onClick={handleSignOut}>Sign out</button>;
}
