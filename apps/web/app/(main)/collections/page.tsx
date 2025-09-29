import CollectionBox from "@/components/CollectionBox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadDialog } from "@/components/UploadDialog";
import { importJWK, JWTPayload, jwtVerify } from "jose";
import prismaClient from "lib/db";
import { Plus } from "lucide-react";
import { cookies } from "next/headers";

export default async function Collections() {
  const cookieStore = await cookies();
  const tokenFromCookie = cookieStore.get('jwtToken') ?? null;
  let userId;
  let collections;
  const secret = process.env.JWT_SECRET || '';
  const jwk = await importJWK({ k: secret, alg: 'HS256', kty: 'oct' });
  
  if (tokenFromCookie) {
    const { payload } = await jwtVerify(tokenFromCookie.value, jwk);
    userId = (payload as JWTPayload).id as string;
    collections = await prismaClient.collection.findMany({
      where: {
        authorId: userId,
      },
      orderBy:{
        updatedAt:"desc",
      }
    });
  }

  return (
    <div className="flex flex-col w-full max-w-[45rem] h-full mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:gap-x-6 mb-6 sm:mb-8 justify-between items-start sm:items-center">
        <p className="text-emerald-300 text-2xl sm:text-3xl font-semibold">
          Your collections
        </p>
        <UploadDialog>
          <Button className="cursor-pointer w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:to-emerald-500">
            <div className="flex gap-x-2 justify-center items-center font-medium text-gray-100">
              <Plus className="w-8 h-8" />
              <p>New Collection</p>
            </div>
          </Button>
        </UploadDialog>
      </div>

      <div>
        <Input
          className="border-gray-400/50 h-10 selection:bg-emerald-300 selection:text-black text-white font-medium w-full"
          placeholder="Search your collections..."
        />
      </div>

      <div className="text-slate-300 text-xs sm:text-sm pl-1 sm:pl-2 my-3">
        <p>
          {collections && collections.length ? collections.length : "No"} collections with
          Endlyptic
        </p>
      </div>

      <div className="text-white grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto custom-scrollbar">
        {collections && collections.length !== 0 &&
          collections.map((collection) => (
              <CollectionBox key={collection.id} {...collection} />
          ))}
      </div>
    </div>
  );
}
