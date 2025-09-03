"use client";
import Image from "next/image";

export default function Page() {
  return (
    <div className="relative flex flex-col h-full justify-between">
      <div className="text-center pt-16">
        <Image
          className="rounded-full scale-200 mx-auto mb-10"
          src={"/endlytic-dark.svg"}
          alt="logo"
          height={150}
          width={150}
        />
        <p className="text-emerald-300 font-normal text-2xl">
          How can I help you today?
        </p>
      </div>

    </div>
  );
}
