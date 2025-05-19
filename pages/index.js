import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

export default function Home() {
  const { user, error, isLoading } = useUser();

  console.log("USER", user);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">this is the homepage</h1>

      {!!user ? (
        <>
          <div className="mb-4">
            <Image src={user.picture} alt={user.name} height={50} width={50} />
          </div>
          <div>{user.email}</div>
          <Link
            href="/api/auth/logout"
            className="text-blue-500 hover:underline"
          >
            Logout
          </Link>
        </>
      ) : (
        <div>
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
