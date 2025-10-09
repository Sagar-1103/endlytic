import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-gradient-to-br from-[#000000] via-[#0c3e37] to-[#040505] lg:bg-[#191919] lg:bg-none">
      <div className="hidden lg:flex flex-col items-center justify-center w-full lg:w-1/3 px-10 py-16 bg-gradient-to-br from-[#000000] via-[#0c3e37] to-[#040505]">
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
      </div>
      {children}
    </div>
  );
}
