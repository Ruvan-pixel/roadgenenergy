"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const { isSignedIn } = useUser();

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between p-4 bg-transparent backdrop-blur-md shadow-md z-50">
      <div className="text-2xl font-bold text-black">SpeedBreaker</div>
      <div className="flex gap-4 items-center">
        <Link href="/" className="hover:underline text-black">Home</Link>
        {isSignedIn ? (
          <>
            <Link href="/profile" className="hover:underline text-black">Profile</Link>
            <Link href="/dashboard" className="hover:underline text-black">Dashboard</Link>
            <div className="hover:underline cursor-pointer text-black">
              <UserButton afterSignOutUrl="/" />
            </div>
          </>
        ) : (
          <>
            <Link href="/sign-in" className="hover:underline cursor-pointer text-black">Sign In</Link>
            <Link href="/sign-up" className="hover:underline cursor-pointer text-black">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;