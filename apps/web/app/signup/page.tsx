import Image from "next/image"
import {GoogleLogo,DiscordLogo,GithubLogo,MicrosoftLogo} from "public/icons";

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-[#191919]">
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#000000] via-[#0c3e37] to-[#040505]  px-8 py-12 lg:w-1/3">
        <Image
          src="/endlytic.svg"
          alt="Endlytic Logo"
          width={50}
          height={50}
          priority
        />
        <h1 className="mt-6 text-2xl font-semibold text-white text-center">
          Setup Your Endlytic Account
        </h1>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-white">
        <div className="w-full max-w-sm">

          <h2 className="text-2xl font-semibold">Create your free account</h2>
          <p className="mt-2 text-[#BFBFBF]">Connect to Endlytic with:</p>


          <div className="mt-3 grid md:grid-cols-1 gap-4">
            <Card title="Google" logo={<GoogleLogo/>} />
            <Card title="GitHub" logo={<GithubLogo/>} />
            <Card title="Discord" logo={<DiscordLogo/>} />
            <Card title="Microsoft" logo={<MicrosoftLogo/>} />
          </div>


          <div className="my-4 flex items-center">
            <hr className="flex-1 border-[#DEDEDE]" />
            <span className="mx-3 text-[#DEDEDE] text-sm uppercase">Or continue with email</span>
            <hr className="flex-1 border-[#DEDEDE]" />
          </div>

          <form className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#B0B0B0]"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 w-full rounded-md border border-[#848282] px-3 py-2 text-white placeholder-gray-400 focus:border-gray-500 focus:ring-0 focus:ring-gray-500"
                placeholder="youremail@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#B0B0B0]"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="mt-1 w-full rounded-md border border-[#848282] px-3 py-2 text-white placeholder-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                placeholder="Enter a unique password"
              />
            </div>

            <button
              type="submit"
              disabled
              className="w-full rounded-lg bg-[#222222] border cursor-pointer disabled:cursor-not-allowed border-[#575757] py-2 font-medium text-[#DEDEDE] transition disabled:bg-[#575757]"
            >
              Continue
            </button>
          </form>

          <p className="mt-6 text-gray-400">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              Log in 
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export function Card({ title, logo }: { title: string; logo: string | React.ReactNode }) {
  return (
    <button className="flex items-center justify-center gap-2 rounded-md bg-white py-[5px] px-3 text-black transition hover:scale-105 hover:shadow-md active:scale-95">
       {logo}
      <span className="text-sm font-medium">{title}</span>
    </button>
  )
}
