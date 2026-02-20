import ChatRoomBox from "@/components/ChatRoomBox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { importJWK, JWTPayload, jwtVerify } from "jose";
import prismaClient from "lib/db";
import { MessageSquare, Plus } from "lucide-react";
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
      orderBy: {
        updatedAt: "desc",
      }
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
        <p>{chats && chats.length ? chats.length : "No"} chats with Endlytic</p>
      </div>

      <div className="text-white flex flex-col overflow-y-auto custom-scrollbar flex-1 gap-y-3">
        {chats && chats.length !== 0 ? (
          chats.map((chat) => (
            <ChatRoomBox key={chat.id} {...chat} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            {/* Icon with glow */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-2xl scale-150" />
              <div className="relative bg-gradient-to-br from-emerald-500/15 to-teal-500/10 border border-emerald-500/20 p-5 rounded-2xl">
                <MessageSquare className="w-10 h-10 text-emerald-400/60" />
              </div>
            </div>

            {/* Text */}
            <h3 className="text-base font-semibold text-zinc-200 mb-2">No conversations yet</h3>
            <p className="text-sm text-zinc-500 max-w-[260px] leading-relaxed mb-6">
              Ask anything about your API collections and your chats will appear here.
            </p>

            {/* CTA */}
            <Link href="/chat">
              <Button className="cursor-pointer bg-gradient-to-r from-emerald-500 to-emerald-600 hover:to-emerald-500 shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] transition-all duration-300">
                <div className="flex gap-x-2 items-center font-medium text-gray-100">
                  <Plus className="w-4 h-4" />
                  <p>Start your first chat</p>
                </div>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
