import { useUser } from "@auth0/nextjs-auth0/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "../Logo";
import { useEffect, useState } from "react";

export const AppLayout = ({ children, posts, postId }) => {
  console.log("postId", postId);
  console.log("posts", posts);

  const { user, error, isLoading } = useUser();
  const [tokenCount, setTokenCount] = useState(0);
  const [tokenLoading, setTokenLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setTokenLoading(true);
      fetch("/api/getUserTokens")
        .then((response) => response.json())
        .then((data) => {
          setTokenCount(data.availableTokens);
          setTokenLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching tokens:", err);
          setTokenLoading(false);
        });
    }
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log("USER", user);

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-slate-800">
          <Logo />
          <Link href="/post/new" className="btn">
            New post
          </Link>
          <Link
            href="/token-topup"
            className="block mt-2 text-center px-4 pb-4"
          >
            <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
            <span className="pl-1">
              {tokenLoading ? "Loading..." : `${tokenCount} tokens available`}
            </span>
          </Link>
        </div>
        <div className="px-4 flex-1 overflow-auto bg-slate-800">
          {posts &&
            posts.map((post) => (
              <Link
                key={post._id}
                href={`/post/${post._id}`}
                className={`py-1 border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-sm ${
                  postId === post._id ? "bg-white/20 border-white" : ""
                }`}
              >
                {post.topic}
              </Link>
            ))}
        </div>
        <div className="bg-cyan-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-2">
          {!!user ? (
            <>
              <div className="min-w-[50px]">
                <Image
                  src={user.picture}
                  alt={user.name}
                  height={50}
                  width={50}
                />
              </div>
              <div className="flex-1">
                <div className="font-bold">{user.email}</div>
                <Link className="text-sm" href="/api/auth/logout">
                  Logout
                </Link>
              </div>
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
      </div>
      {children}
    </div>
  );
};
