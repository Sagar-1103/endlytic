"use client";
import Image from "next/image";
import { Button } from "./ui/button";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import menuAnimation from "../../public/menu-animation.json";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import LoginButton from "./ui/loginbutton";

export default function Header() {

  const navlinks = [
    { id: 1, title: "Features", link: "#features" },
    { id: 2, title: "About", link: "#" },
    // { id: 3, title: "Pricing", link: "#" },
    { id: 4, title: "FAQ", link: "#faq" },
    { id: 5, title: "Contact", link: "#" },
  ];

  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.goToAndStop(0, true);
    }
  }, []);

  const handleMenuClick = () => {
    if (!lottieRef.current) return;
    if (!isMenuOpen) {
      lottieRef.current.playSegments([0, 30], true);
    } else {
      lottieRef.current.playSegments([40, 70], true);
    }

    setIsMenuOpen((prev) => !prev);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.1, staggerDirection: -1 },
    },
  };

  const itemVariants = {
    hidden: { x: 80, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 60 },
    },
    exit: { x: 80, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="fixed w-full bg-[#07090e]/50 backdrop-blur-md z-100">
      <nav className="my-5 w-[90%] lg:w-[70%] mx-auto">
        <div className="flex justify-between w-full">
          {/* Brand */}
          <div className="flex flex-row gap-x-1">
            <Image
              src={"/endlytic-dark.svg"}
              className="rounded-sm scale-250"
              alt="logo"
              width={30}
              height={30}
            />
            <p className="text-white my-auto font-semibold text-3xl">
              Endlytic
            </p>
          </div>

          {/* Links  */}
          <div className="text-white/70 hidden flex-row gap-x-6 sm:flex">
            {navlinks.map((navlink) => (
              <Link
                href={navlink.link}
                key={navlink.id}
                className="my-auto hover:text-white cursor-pointer "
              >
                {navlink.title}
              </Link>
            ))}
          </div>

          {/* Buttons  */}
          <div className="my-auto">
            <LoginButton/>
            {/* <Button
              className="sm:flex hidden cursor-pointer font-bold text-lg rounded-lg bg-white text-black hover:shadow-[inset_0_0_10px_1px_#ffffff,_0_0_50px_-10px_#00FFA6] hover:text-gray-800 hover:bg-[#00e593] transition-all duration-300 transform"
              variant={"default"}
              onClick={()=>{router.push("/login")}}
            >
              Login
            </Button> */}
            <div
              className="block sm:hidden h-10 w-10"
              onClick={handleMenuClick}
            >
              <Lottie
                lottieRef={lottieRef}
                animationData={menuAnimation}
                loop={false}
                autoPlay={false}
                className="scale-300"
              />
            </div>
          </div>
        </div>
        {/* Links  */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col pt-5 gap-x-6 sm:hidden"
            >
              {navlinks.map((navlink) => (
                <Link href={navlink.link} key={navlink.id}>
                  <motion.p
                    variants={itemVariants}
                    className="my-2.5 text-white cursor-pointer font-normal text-xl"
                  >
                    {navlink.title}
                  </motion.p>
                </Link>
              ))}
              <motion.div variants={itemVariants}>
                <Button
                  className="cursor-pointer w-full rounded-lg mt-6 font-bold text-lg bg-white text-black hover:shadow-[inset_0_0_10px_1px_#ffffff,_0_0_50px_-10px_#00FFA6] hover:text-gray-800 hover:bg-[#00e593] transition-all duration-300 transform"
                  variant={"default"}
                >
                  Login
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <div className="w-[80%] mx-auto bg-gradient-to-r from-transparent via-gray-700/50 to-transparent h-[0.5px]"></div>
    </div>
  );
}
