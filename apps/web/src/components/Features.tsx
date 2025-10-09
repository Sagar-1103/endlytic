import { Badge } from "./ui/badge";

export default function Features() {
  const features = [
    {
      id: 1,
      title: "Upload & Explore APIs",
      description: "Upload Postman collections or Swagger files and instantly explore endpoints and parameters.",
      alt: "feat-1",
      width: "sm:w-full lg:w-[48%]",
    },
    {
      id: 2,
      title: "Natural Language API Search",
      description: "Ask questions in plain English to find endpoints, parameters and request details.",
      alt: "feat-2",
      width: "sm:w-full lg:w-[48%]",
    },
    {
      id: 3,
      title: "AI Teammate",
      description: "Endlytic's AI turns complex API specs into clear answers so you stay focused.",
      alt: "feat-3",
      width: "sm:w-full lg:w-[38%]",
    },
    {
      id: 4,
      title: "Instant Code Generation",
      description: "Generate ready-to-use code snippets in multiple programming languagesfrom your API collection.",
      alt: "feat-4",
      width: "sm:w-full lg:w-[58%]",
    },
  ];

  return (
    <section id="features">
      <div className="w-[90%] md:w-[85%] lg:w-[80%] min-h-screen mx-auto flex flex-col pt-32 text-white">
        
        <div className="flex flex-col gap-4 mb-20 text-center">
          <Badge className="bg-[#071113]/80 backdrop-blur-sm py-2 px-4 mx-auto rounded-xl border border-[#7bb7a2]/30">
            <span className="bg-gradient-to-r text-sm from-[#00e593] to-white text-transparent bg-clip-text font-medium">
              Features
            </span>
          </Badge>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl max-w-4xl mx-auto font-bold tracking-tight leading-snug">
            Powerful Features for Effortless API Integration
          </h2>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Discover tools that make API exploration, testing, and integration seamless.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 justify-center">
          {features.map((feat) => (
            <div
              key={feat.id}
              className={`${feat.width} min-h-[360px] relative overflow-hidden rounded-2xl border border-white/10  backdrop-blur-sm transition-all duration-500 hover:border-emerald-500/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/20 group cursor-pointer`}
            >
              <div className="bg-[url(/landing-background.png)] absolute inset-0 bg-[length:120px_120px] md:bg-[length:300px_300px] bg-repeat opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/50 to-black/60 group-hover:from-emerald-950/30 group-hover:via-black/70 transition-all duration-500" />
              
              <div className="relative h-full flex flex-col justify-center text-center px-6 py-8">
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-[22rem] mx-auto group-hover:text-gray-300 transition-colors">
                    {feat.description}
                  </p>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500/60 group-hover:bg-emerald-400 group-hover:shadow-lg group-hover:shadow-emerald-400/80 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
