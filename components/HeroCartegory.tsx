import { LucideShoppingBag } from "lucide-react";
import React from "react";
import Wrapper from "./Wrapper";
import Link from "next/link";

const HeroCartegory = () => {
  return (
    <div className="relative flex gap-8">
      <Link href={"/categories"}>
        <div className="flex flex-1 max-w-[220px] bg-pink-500 p-3 gap-2 text-white text-xl">
          <LucideShoppingBag />
          <p>Shop by Category</p>
        </div>
      </Link>
      <Link
        href={"/about"}
        className="flex justify-center items-center text-xl"
      >
        <div>About Us</div>
      </Link>
      <Link
        href={"#contact"}
        className="flex justify-center items-center text-xl"
      >
        <div>Contact Us</div>
      </Link>
    </div>
  );
};

export default HeroCartegory;
