import { IMAGES } from "@/public";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <header className="w-full flex justify-center items-center">
      <Link href={"/"}>
        <Image
          src={IMAGES.logo}
          alt="Official Logo"
          width={60}
          height={60}
          priority
        />
      </Link>
    </header>
  );
}
