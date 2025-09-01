import Image from "next/image";
import { Badge } from "./ui/badge";

export default function Features() {
  const features = [
    {
      id: 1,
      title: "Instant Code Generation",
      description: "Upload your API spec and get instant, ready-to-use code snippets in multiple languages.",
      img: "/feat-1.avif",
      alt: "feat-1",
      width: "sm:w-full lg:w-[48%]",
    },
    {
      id: 2,
      title: "Natural Language API Search",
      description: "Ask questions in plain English to find endpoints, parameters and request details.",
      img: "/feat-2.avif",
      alt: "feat-2",
      width: "sm:w-full lg:w-[48%]",
    },
    {
      id: 3,
      title: "AI Teammate",
      description: "Endlytic’s AI turns complex API specs into clear answers so you stay focused.",
      img: "/feat-3.avif",
      alt: "feat-3",
      width: "sm:w-full lg:w-[38%]",
    },
    {
      id: 4,
      title: "Interactive API Playground",
      description: "Test endpoints directly within the platform. Run requests, view responses in real time and share results with your team.",
      img: "/feat-4.avif",
      alt: "feat-4",
      width: "sm:w-full lg:w-[58%]",
    },
  ];
  return (
    <section id="features">
      <div className="w-[90%] md:[80%] min-h-screen mx-auto flex flex-col pt-32 justify-items-center text-center text-white gap-y-7">
        <div className="flex flex-col gap-y-5">
          <Badge className="bg-[#071113] py-2 px-3 mx-auto rounded-2xl my-auto justify-items-center border-[#7bb7a2]/30">
            <p className="bg-gradient-to-r text-sm from-[#00e593] to-white text-transparent bg-clip-text">
              Features
            </p>
          </Badge>
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl w-[100%] md:w-[80%] lg:w-[50%] xl:w-[40%] mx-auto font-semibold">
            Powerful Features for Effortless API Integration
          </p>
          <p className="text-gray-400 text-lg w-[100%] sm:w-[90%] md:w-[83%] lg:w-[65%] xl:w-[53%] sm:text-lg md:text-xl lg:text-text-xl xl:text-xl mx-auto">
            Discover tools that make API exploration, testing and integration
            seamless.
          </p>
        </div>

        <div className="w-full md:w-[80%] mx-auto flex flex-wrap justify-center gap-4">
          {features.map((feat) => (
            <div
              key={feat.id}
              className={`${feat.width} h-78 md:h-96 overflow-hidden bg-[#0c0e13] border-t-1 border-1 border-gray-800/60 border-t-gray-500/60 rounded-2xl`}
            >
              <div className="pt-6 px-6 text-start">
                <p className="text-2xl md:text-3xl font-semibold">{feat.title}</p>
                <p className="mt-3 text-sm md:text-md lg:text-lg text-gray-400 w-[90%]">{feat.description}</p>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-b absolute from-transparent from-50% to-[#07090e] w-full h-full" />
                <Image
                  src={feat.img}
                  alt={feat.alt}
                  width={1000}
                  height={1000}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
