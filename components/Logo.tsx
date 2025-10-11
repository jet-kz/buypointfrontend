import React from "react";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <div className="relative flex items-center gap-2">
        <div className="relative">
          <h2 className="font-semibold text-primary text-xl leading-[1]">
            Buypoint
          </h2>
          <p className="text-sm text-primary">Online store</p>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
