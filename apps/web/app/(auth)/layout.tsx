import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-gradient-to-br from-[#000000] via-[#0c3e37] to-[#040505] lg:bg-[#191919] lg:bg-none">
      <div className=" hidden lg:block flex-col items-center justify-center bg-gradient-to-br from-[#000000] via-[#0c3e37] to-[#040505]  px-8 py-12 lg:w-1/3">
        <Image
          src="/endlytic-dark.svg"
          alt="Endlytic Logo"
          width={200}
          height={200}
          priority
          className="scale-200 mx-auto"
        />
        <h1 className="mt-6 text-2xl font-semibold text-white text-center">
          Setup Your Endlytic Account
        </h1>
      </div>
      {children}
    </div>
  );
}
