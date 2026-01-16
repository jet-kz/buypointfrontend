import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  compact?: boolean;
}

const Logo: React.FC<LogoProps> = ({ compact }) => {
  return (
    <Link href="/" className="group flex items-center gap-1.5">
      <div className="flex flex-col">
        <h2 className={`${compact ? 'text-xl' : 'text-2xl'} font-black tracking-tighter transition-all group-hover:opacity-80`}>
          <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
            {compact ? "Buypoint" : "Buypoint"}
          </span>
        </h2>
        {!compact && (
          <p className="hidden sm:block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 dark:text-zinc-500 -mt-1 ml-0.5">

          </p>
        )}
      </div>
    </Link>
  );
};

export default Logo;
