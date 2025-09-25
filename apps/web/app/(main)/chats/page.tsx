import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { importJWK, JWTPayload, jwtVerify } from "jose";
import prismaClient from "lib/db";
import { Plus, Trash2 } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Chats() {
  const cookieStore = await cookies();
  const tokenFromCookie = cookieStore.get('jwtToken') ?? null;
  let userId;
  let chats;
  const secret = process.env.JWT_SECRET || '';
  const jwk = await importJWK({ k: secret, alg: 'HS256', kty: 'oct' });
  
  if (tokenFromCookie) {
    const { payload } = await jwtVerify(tokenFromCookie.value, jwk);
    userId = (payload as JWTPayload).id as string;
    chats = await prismaClient.chat.findMany({
      where: {
        authorId: userId,
      },
    });
  }


  return (
    <div className="flex flex-col w-full max-w-[45rem] h-full mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-6 mb-6 sm:mb-8 justify-between items-start sm:items-center">
        <p className="text-emerald-300 text-2xl sm:text-3xl font-semibold">
          Your chat history
        </p>
        <Link href={"/chat"}>
          <Button
            className="cursor-pointer w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:to-emerald-500"
          >
            <div className="flex gap-x-2 justify-center items-center font-medium text-gray-100">
              <Plus className="w-8 h-8" />
              <p>New Chat</p>
            </div>
          </Button>
        </Link>
      </div>

      <div>
        <Input
          className="border-gray-400/50 h-10 selection:bg-emerald-300 selection:text-black text-white font-medium w-full"
          placeholder="Search your chats..."
        />
      </div>

      <div className="text-slate-300 text-xs sm:text-sm pl-1 sm:pl-2 my-3">
        <p>{chats && chats.length ? chats.length : "No"} chats with Endlyptic</p>
      </div>

      <div className="text-white flex flex-col overflow-y-auto custom-scrollbar flex-1 gap-y-3">
        {chats && chats.length !== 0 &&
          chats.map((chat) => (
            <div
              key={chat.id}
              className="border-gray-400/20 border py-2 pl-3 sm:p-4 group relative hover:bg-gray-400/10 cursor-pointer rounded-lg mr-[3px]"
            >
              <p className="font-medium text-sm sm:text-base truncate">{chat.title}</p>
              <span className="text-xs sm:text-sm text-gray-300/70 block">
                Last message 6 minutes ago
              </span>
              <div className="absolute hidden group-hover:block top-4 sm:top-6 hover:bg-gray-600 p-1 rounded-sm right-3">
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 hover:text-red-400 group-hover:text-gray-400" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
