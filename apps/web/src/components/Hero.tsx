import Image from "next/image";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Play } from "lucide-react";

export default function Hero() {
  return (
    <div className="w-[80%] min-h-screen mx-auto flex flex-col justify-items-center text-center text-white py-40 gap-y-7">
      <div className="flex justify-center gap-x-2 ">
        <Badge className="bg-[#00e593] rounded-full">NEW</Badge>
        <p className="bg-gradient-to-r from-[#00e593] to-white text-transparent bg-clip-text">
          Turn API Chaos into Clarity!
        </p>
      </div>

      <p className="text-6xl mx-auto font-semibold">
        Effortless API Understanding for <br /> Modern Development Teams
      </p>

      <div className="flex flex-col gap-y-7 w-[100%] xl:w-[80%] mx-auto relative">
        <div className="bg-[url(/landing-background.png)] mx-auto -z-10 bg-[length:400px_400px] w-full h-full bg-repeat absolute before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_center,_transparent_0%,_transparent_10%,_#07090e_100%)] before:pointer-events-none" />
        <p className="text-gray-400 text-2xl mx-auto">
          Upload your API spec or Postman collection to get instant insights <br /> and
          ready to use code snippets in multiple languages.
        </p>

        <div className="flex flex-row gap-x-4 justify-center mb-20">
          <Button
            className="cursor-pointer rounded-xl py-5 font-bold text-lg text-gray-800 shadow-[inset_0_0_10px_1px_#ffffff] hover:shadow-[inset_0_0_10px_1px_#ffffff,_0_0_50px_-10px_#00FFA6] hover:bg-[#00e593] bg-[#00e593] transition-all duration-300 transform"
            variant={"default"}
          >
            Try Endlytic
          </Button>
        </div>

        <div className="relative w-full sm:w-[95%] md:w-[95%] lg:w-[95%] mx-auto">
          <div className="absolute top-0 left-0 w-1/4 h-1/2">
            <div className="absolute -inset-1 bg-white rounded-xl blur-sm"></div>
            <div className="absolute -inset-3 bg-[#00e593]/30 rounded-xl blur-md"></div>
            <div className="absolute -inset-6 bg-[#00e593]/25 rounded-xl blur-lg"></div>
            <div className="absolute -inset-10 bg-[#00e593]/20 rounded-xl blur-xl"></div>
            {/* <div className="absolute -inset-16 bg-[#00e593]/15 rounded-xl blur-2xl"></div> */}
            {/* <div className="absolute -inset-24 bg-[#00e593]/10 rounded-xl blur-3xl"></div>
            <div className="absolute -inset-32 bg-[#00e593]/5 rounded-xl blur-3xl"></div> */}
          </div>

          <div className="absolute top-0 left-1/4 w-1/2 h-1/2">
            <div className="absolute -inset-1 bg-white rounded-xl blur-sm"></div>
            <div className="absolute -inset-2 bg-blue-400/30 rounded-xl blur-md"></div>
            <div className="absolute -inset-4 bg-blue-400/25 rounded-xl blur-lg"></div>
            <div className="absolute -inset-6 bg-blue-400/20 rounded-xl blur-xl"></div>
          </div>

          <div className="absolute top-0 right-0 w-1/4 h-1/2">
            <div className="absolute -inset-1 bg-white rounded-xl blur-sm"></div>
            <div className="absolute -inset-2 bg-pink-400/30 rounded-xl blur-md"></div>
            <div className="absolute -inset-4 bg-pink-400/25 rounded-xl blur-lg"></div>
            <div className="absolute -inset-6 bg-pink-400/20 rounded-xl blur-xl"></div>
          </div>

          <div className="relative rounded-xl overflow-hidden z-10">
            <div className="bg-gradient-to-b absolute from-transparent to-[#07090e] w-full h-full" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2c2d31] p-3 cursor-pointer shadow-2xl shadow-gray-950 rounded-full group hover:scale-105 transition-all duration-300 ease-out">
              <div className="rounded-full bg-[#414347] p-3 flex items-center gap-x-2 transition-all duration-300 ease-out group-hover:px-4">
                <Play
                  fill="white"
                  className="w-5 h-5 transition-transform duration-300 ease-out group-hover:scale-110"
                />
                <p className="text-white text-sm transition-all duration-300 ease-out group-hover:block hidden">
                  See Aurix in Action
                </p>
              </div>
            </div>
            <Image
              src={"/dashboard.avif"}
              alt="dashboard"
              width={2000}
              height={2000}
              className="rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
