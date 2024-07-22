import RequestSongInputForm from "@/components/client/reqInput";
import SongList from "@/components/list";
import prisma from "@/lib/prisma";
import {cn} from "@/lib/utils";

export default async function Home() {
  const session = (await prisma.session.findMany())[0];

  const song = await prisma.song.findMany();

  return (
    <main className="grid min-h-dvh grid-cols-1 grid-rows-[auto,1fr,auto] gap-6 p-4">
      {session ? (
        <>
          <section className={cn("flex justify-center items-center")}>
            <SongList initData={song} />
          </section>
          <section className={cn("flex justify-center items-center")}>
            <RequestSongInputForm session={session} />
          </section>
        </>
      ) : (
        <div className="flex justify-center items-center text-2xl">
          ช่วงเวลาของการขอเพลงยังไม่เปิด...
        </div>
      )}
    </main>
  );
}
