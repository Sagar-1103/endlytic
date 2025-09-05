"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push("/login")}
      className="sm:flex hidden cursor-pointer font-bold text-lg rounded-lg bg-white text-black hover:shadow-[inset_0_0_10px_1px_#ffffff,_0_0_50px_-10px_#00FFA6] hover:text-gray-800 hover:bg-[#00e593] transition-all duration-300 transform"
      variant="default"
    >
      Login
    </Button>
  );
}
