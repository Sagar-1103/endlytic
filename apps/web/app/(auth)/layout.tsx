import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-gradient-to-br from-[#000000] via-[#0c3e37] to-[#040505] lg:bg-[#191919] lg:bg-none">
      <Link
        href="/"
        className="hidden lg:flex flex-col items-center justify-center w-full lg:w-1/3 px-10 py-16 bg-gradient-to-br from-[#000000] via-[#0c3e37] to-[#040505] cursor-pointer hover:opacity-90 transition-opacity duration-300"
      >
        <Image
          src="/endlytic-dark.svg"
          alt="Endlytic Logo"
          width={180}
          height={180}
          priority
          className="mx-auto transition-transform duration-300 scale-150"
        />
        <h1 className="text-2xl font-semibold text-white text-center">
          Setup Your Endlytic Account
        </h1>
      </Link>
      <div className="relative flex-1 flex flex-col">
        <div className="absolute top-6 right-6 z-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            Back to Home
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}

