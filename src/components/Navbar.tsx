"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar as NavbarData } from "@/constants";
import { MobileMenu } from "./MobileView";
import WalletConnect from "./WalletConnect";
import { useAccount } from "wagmi";

const Navbar = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  // Handle navigation to dashboard when wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      router.push("/dashboard");
    }
  }, [isConnected, address, router]);

  return (
    <div className="flex justify-between px-4 sm:px-8 md:px-20 py-4 fixed w-full bg-white z-50 border-b">
      <Link href={"/"}>
        <h2 className="font-bold">Rare evo 2025</h2>
      </Link>
      <div className="md:flex gap-5 hidden">
        {NavbarData.map((nav) => (
          <Link
            href={nav.link}
            key={nav.label}
            className="hover:text-gray-600 transition-colors"
          >
            {nav.label}
          </Link>
        ))}
      </div>
      <div className="hidden md:flex gap-5 items-center">
        {/* <ThemeToggle /> */}
        <WalletConnect />
      </div>
      <div className="md:hidden">
        <MobileMenu />
      </div>
    </div>
  );
};

export default Navbar;
