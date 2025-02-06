"use client"

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { useUser } from "@clerk/clerk-react";
import HeaderLogo from "./HeaderLogo";

const NavBar = () => {
  const { user } = useUser();

  return (
    <div>
      <div className="flex justify-between px-4 py-4 sm:px-32 sm:py-6">
        <HeaderLogo variant="blue" />
        {user ? (
          <Link href={"/overview"}>
            <Button>
            Dashboard
          </Button>
          </Link>
        ) : (
          <Link href={"/sign-in"}>
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default NavBar;
