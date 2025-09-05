import Image from "next/image";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Play } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="hero" className="overflow-x-hidden">
      <div className="w-[90%] md:[80%] min-h-screen mx-auto flex flex-col justify-items-center text-center text-white pt-28 md:pt-40 gap-y-7">
        <div className="flex justify-center gap-x-2 ">
          <Badge className="bg-[#00e593] rounded-full">NEW</Badge>
          <p className="bg-gradient-to-r from-[#00e593] to-white text-transparent bg-clip-text">
            Turn API Chaos into Clarity!
          </p>
        </div>

        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl text-wrap mx-auto font-semibold w-[100%] md:w-[90%] lg:w-[80%] xl:w-[60%]">
          Effortless API Understanding for Modern Development Teams
        </p>

        <div className="flex flex-col gap-y-7 w-[100%] xl:w-[80%] mx-auto relative">
          <div className="bg-[url(/landing-background.png)] mx-auto -z-10 bg-[length:200px_200px] md:bg-[length:325px_325px] w-full h-full bg-repeat absolute before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_center,_transparent_0%,_transparent_10%,_#07090e_100%)] before:pointer-events-none" />
          <p className="text-gray-400 text-lg sm:text-xl md:text-2xl lg:text-text-2xl xl:text-2xl mx-auto text-wrap w-[100%] sm:w-[90%] md:w-[83%] lg:w-[65%] xl:w-[53%]">
            Upload your API spec or Postman collection to get instant insights
            and ready to use code snippets in multiple languages.
          </p>

          <div className="flex flex-row gap-x-4 justify-center mb-20">
            <Link href={"/login"}>
              <Button
                className="cursor-pointer rounded-xl py-5 font-bold text-md md:text-lg text-gray-800 shadow-[inset_0_0_10px_1px_#ffffff] hover:shadow-[inset_0_0_10px_1px_#ffffff,_0_0_50px_-10px_#00FFA6] hover:bg-[#00e593] bg-[#00e593] transition-all duration-300 transform"
                variant={"default"}
              >
                Try Endlytic
              </Button>
            </Link>
          </div>

          <div className="relative w-full sm:w-[95%] md:w-[95%] lg:w-[95%] mx-auto">
            <div className="absolute top-0 left-0 w-1/4 h-1/3 sm:h-1/2">
              <div className="absolute -inset-1 bg-white rounded-xl blur-sm"></div>
              <div className="absolute -inset-3 bg-[#00e593]/30 rounded-xl blur-md"></div>
              <div className="absolute -inset-6 bg-[#00e593]/25 rounded-xl blur-lg"></div>
              <div className="absolute -inset-10 bg-[#00e593]/20 rounded-xl blur-xl"></div>
              <div className="absolute -inset-16 bg-gray-300/15 rounded-xl blur-2xl"></div>
            </div>

            <div className="absolute top-0 left-1/4 w-1/2 h-1/3 sm:h-1/2">
              <div className="absolute -inset-1 bg-white rounded-xl blur-sm"></div>
              <div className="absolute -inset-2 bg-blue-400/30 rounded-xl blur-md"></div>
              <div className="absolute -inset-4 bg-blue-400/25 rounded-xl blur-lg"></div>
              <div className="absolute -inset-6 bg-blue-400/20 rounded-xl blur-xl"></div>
              <div className="absolute -inset-10 bg-blue-400/15 rounded-xl blur-xl"></div>
              <div className="absolute -inset-16 bg-gray-300/15 rounded-xl blur-2xl"></div>
            </div>

            <div className="absolute top-0 right-0 w-1/4 h-1/3 sm:h-1/2">
              <div className="absolute -inset-1 bg-white rounded-xl blur-sm"></div>
              <div className="absolute -inset-2 bg-pink-400/30 rounded-xl blur-md"></div>
              <div className="absolute -inset-4 bg-pink-400/25 rounded-xl blur-lg"></div>
              <div className="absolute -inset-6 bg-pink-400/20 rounded-xl blur-xl"></div>
              <div className="absolute -inset-10 bg-pink-400/15 rounded-xl blur-xl"></div>
              <div className="absolute -inset-16 bg-gray-300/15 rounded-xl blur-2xl"></div>
            </div>

            <div className="relative overflow-hidden z-10">
              <div className="bg-gradient-to-b absolute from-transparent to-[#07090e] w-full h-full" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2c2d31] p-2 md:p-3 cursor-pointer shadow-2xl shadow-gray-950 rounded-full group hover:scale-105 transition-all duration-300 ease-out">
                <div className="rounded-full bg-[#414347] p-2 md:p-3 flex items-center gap-x-2 transition-all duration-300 ease-out group-hover:px-4">
                  <Play
                    fill="white"
                    className="h-3 w-3 sm:h-3 md:w-5 md:h-5  transition-transform duration-300 ease-out group-hover:scale-110"
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
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
