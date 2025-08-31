import Image from "next/image";
import { Button } from "./ui/button";

export default function Header() {
  const navlinks = [
    { id: 1, title: "Product" },
    { id: 2, title: "About" },
    { id: 3, title: "Pricing" },
    { id: 4, title: "Contact" },
  ];
  return (
    <div className="fixed w-full bg-[#07090e]/50 backdrop-blur-md z-100">
      <nav className="flex justify-between my-5 w-[70%] mx-auto">
        {/* Brand */}
        <div className="flex flex-row gap-x-1">
          <Image
            src={"/endlytic.svg"}
            className="rounded-sm"
            alt="logo"
            width={30}
            height={30}
          />
          <p className="text-white my-auto font-semibold text-3xl">Endlytic</p>
        </div>

        {/* Links  */}
        <div className="text-white/70 hidden flex-row gap-x-6 lg:flex">
          {navlinks.map((navlink) => (
            <p
              key={navlink.id}
              className="my-auto hover:text-white cursor-pointer "
            >
              {navlink.title}
            </p>
          ))}
        </div>

        {/* Buttons  */}
        <div className="my-auto">
          <Button
            className="lg:flex hidden cursor-pointer font-bold text-lg bg-white text-black hover:shadow-[inset_0_0_10px_1px_#ffffff,_0_0_50px_-10px_#00FFA6] hover:text-gray-800 hover:bg-[#00e593] transition-all duration-300 transform"
            variant={"default"}
          >
            Login
          </Button>
        </div>
      </nav>
      <div className="w-[80%] mx-auto bg-gradient-to-r from-black  via-gray-500  to-black  h-[0.5px]"></div>
    </div>
  );
}
