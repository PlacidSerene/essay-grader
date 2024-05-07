"use client";
import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";

const MobileNav = ({ isAuth }: { isAuth: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen((prev) => !prev);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) toggleOpen();
  }, [pathname]);

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      toggleOpen();
    }
  };
  return (
    <div className="sm:hidden">
      <Menu
        onClick={toggleOpen}
        className="relative z-50 h-5 w-5 text-zinc-700"
      />
      {isOpen ? (
        <div className="animate-in slide-in-from-top-5 fade-in-20 fixed inset-0 z-0 w-full">
          <ul className="absolute grid w-full gap-3 border-b border-zinc-200 bg-white px-10 pb-8 pt-20 shadow-xl">
            {!isAuth ? (
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/sign-up")}
                    href="/sign-up"
                    className="flex w-full items-center font-semibold text-green-600"
                  >
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </li>
                <li className="bg-gray-300s my-3 h-px w-full" />
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/sign-in")}
                    href="/sign-in"
                    className="flex w-full items-center font-semibold"
                  >
                    Sign in
                  </Link>
                </li>
                <li className="bg-gray-300s my-3 h-px w-full" />
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/pricing")}
                    href="/pricing"
                    className="flex w-full items-center font-semibold"
                  >
                    Pricing
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/dashboard")}
                    href="/dashboard"
                    className="flex w-full items-center font-semibold"
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="bg-gray-300s my-3 h-px w-full" />
                <li>
                  <Link
                    onClick={() => closeOnCurrent("/sign-out")}
                    href="/sign-out"
                    className="flex w-full items-center font-semibold"
                  >
                    Sign out
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default MobileNav;
