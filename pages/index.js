import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Next.js with Auth0</h1>

      {user ? (
        <div>
          <div className="mb-4">
            <p>Welcome, {user.name}!</p>
            <p>Email: {user.email}</p>
          </div>
          <Link
            href="/api/auth/logout"
            className="text-blue-500 hover:underline"
          >
            Logout
          </Link>
        </div>
      ) : (
        <div>
          <p className="mb-4">You are not logged in.</p>
          <Link
            href="/api/auth/login"
            className="text-blue-500 hover:underline"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
}
