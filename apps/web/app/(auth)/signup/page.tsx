"use client"
import { signIn } from "next-auth/react"
import { useState } from "react";
import { signUp } from "app/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { providers } from "@/data/provider-data";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (error: string) => {
    const errorMap: Record<string, string> = {
      CredentialsSignin: "Invalid email or password",
      Default: "Something went wrong. Please try again.",
    };
    return errorMap[error] || error;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    toast.promise(
      (async () => {
        const signUpResult = await signUp({ email, password });
        if (signUpResult.error) {
          setError(signUpResult.error || "Sign up failed");
          setLoading(false);
          throw new Error(signUpResult.error);
        }
        const signInResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (signInResult?.error) {
          const msg = getErrorMessage(signInResult.error);
          setError(msg);
          setLoading(false);
          throw new Error(msg);
        }
        router.push("/");
        return "Account created and logged in!";
      })().catch((err) => {
        setLoading(false);
        throw err;
      }),
      {
        loading: "Creating account...",
        success: (msg) => msg,
        error: (err) => err.message || "Failed to create account",
      }
    );
  };


  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-white">
      <div className="w-full max-w-sm">

        <h2 className="text-2xl font-semibold">Create your free account</h2>
        <p className="mt-2 text-[#BFBFBF]">Connect to Endlytic with:</p>


        <div className="mt-3 grid md:grid-cols-1 gap-4">
          {
            providers.map((provider) => (
              <Card key={provider.id} title={provider.title} logo={provider.logo} id={provider.id} />
            ))
          }
        </div>


        <div className="my-4 flex items-center">
          <hr className="flex-1 border-[#DEDEDE]" />
          <span className="mx-3 text-[#DEDEDE] text-sm uppercase">Or continue with email</span>
          <hr className="flex-1 border-[#DEDEDE]" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
              value={email}
              onChange={(e) => { setEmail(e.target.value), setError("") }}
              required
              className="mt-1 w-full rounded-md border border-[#848282] px-3 py-2 text-white placeholder-gray-400 focus:border-gray-500 focus:ring-0 focus:ring-gray-500"
              placeholder="Enter your email"
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
              value={password}
              onChange={(e) => { setPassword(e.target.value), setError("") }}
              required
              className="mt-1 w-full rounded-md border border-[#848282] px-3 py-2 text-white placeholder-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              placeholder="Enter a password"
            />
            {/* <div className="mt-2 text-red-500">{error}</div> */}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[#B0B0B0]"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value), setError("") }}
              required
              className="mt-1 w-full rounded-md border border-[#848282] px-3 py-2 text-white placeholder-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              placeholder="Re-enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={!email || !password || !confirmPassword || loading}
            className="w-full rounded-lg bg-[#222222] border cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 border-[#575757] py-2 font-medium text-[#DEDEDE] transition disabled:bg-[#575757]"
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
  )
}

function Card({ title, logo, id }: { title: string; logo: string | React.ReactNode; id: string }) {
  return (
    <button
      type="button"
      onClick={() => signIn(id, { callbackUrl: "/chat" })}
      className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-white py-[5px] px-3 text-black transition hover:scale-102 hover:shadow-md active:scale-95">
      {logo}
      <span className="text-sm font-medium">{title}</span>
    </button>
  )
}
