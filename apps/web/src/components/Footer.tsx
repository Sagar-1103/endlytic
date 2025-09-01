import Link from "next/link";
import { Button } from "./ui/button";

export default function Footer() {
  return (
    <div className="w-[100%] lg:w-[80%] mx-auto">
      <div className="flex flex-col gap-y-10 justify-center items-center text-center w-full min-h-screen relative overflow-hidden">
        <div className="bg-[url(/landing-background.png)] z-10 mx-auto bg-[length:200px_200px] md:bg-[length:325px_325px] w-[80%] h-full bg-repeat absolute before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_center,_transparent_5%,_transparent_5%,_#07090e_100%)] before:pointer-events-none" />
        <div className="mx-auto z-20 w-[80%] hidden sm:block h-full bg-repeat absolute before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_center,_transparent_5%,_transparent_5%,_#07090e_100%)] before:pointer-events-none" />
        <div className="mx-auto z-20 w-[80%] hidden sm:block h-full bg-repeat absolute before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_center,_transparent_5%,_transparent_5%,_#07090e_100%)] before:pointer-events-none" />
        <div className="mx-auto z-10 w-[80%] h-full hidden sm:block bg-repeat absolute before:absolute before:inset-50 before:blur-2xl before:bg-[radial-gradient(circle_at_50%_120%,_rgba(255,255,255,0.25)_0%,_rgba(208,217,210,0.2)_30%,_transparent_70%)] before:pointer-events-none" />
        <div className="mx-auto z-10 w-[80%] h-full block sm:hidden bg-repeat absolute before:absolute before:inset-10 before:blur-2xl before:bg-[radial-gradient(circle_at_50%_60%,_rgba(255,255,255,0.25)_0%,_rgba(208,217,210,0.2)_30%,_transparent_70%)] before:pointer-events-none" />
        <p className="text-3xl sm:4xl md:text-5xl lg:text-6xl text-white px-6 md:px-16 font-semibold max-w-[700px]">
          Ready to Simplify API Integration?
        </p>
        <p className="text-md sm:text-md md:text-lg lg:text-xl text-gray-300 px-6 max-w-[300px] md:max-w-[400px] lg:max-w-[500px]">
          Start using Endlytic today and turn complex API docs into instant
          answers.
        </p>
        <div className="flex flex-row gap-x-4 z-30 justify-center mb-20">
          <Button
            className="cursor-pointer rounded-xl py-5 px-8 font-bold text-md md:text-lg text-gray-800 shadow-[inset_0_0_10px_1px_#ffffff] hover:shadow-[inset_0_0_10px_1px_#ffffff,_0_0_50px_-10px_#00FFA6] hover:bg-[#00e593] bg-[#00e593] transition-all duration-300 transform"
            variant={"default"}
          >
            Try Endlytic
          </Button>
        </div>
      </div>

      <div className="w-full md:w-[80%] mx-auto bg-[#07090e] -mt-15 z-50 relative text-gray-400">
        <div className="w-full mx-auto bg-gray-700/40 h-[0.5px]"></div>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-row justify-between items-center text-sm text-gray-500">
          <p className=" z-30">© 2025 Endlytic</p>
          <Link href={"https://github.com/sagar-1103/endlytic/"} target="_blank" rel="noreferrer">
            <svg
              className="stroke-white z-30 fill-gray-200 hover:fill-gray-500 cursor-pointer transition-colors duration-200"
              strokeWidth="0"
              viewBox="0 0 496 512"
              height="25"
              width="25"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
