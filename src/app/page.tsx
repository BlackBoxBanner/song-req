import InfiniteText from "@/components/basic/infiniteText";
import RequestSongInputForm from "@/components/client/reqInput";
import SongList from "@/components/list";
import prisma from "@/lib/prisma";
import {cn} from "@/lib/utils";

export default async function Home() {
  const song = await prisma.song.findMany({
    orderBy: {
      createAt: "asc",
    },
  });

  return (
    <main className="snap-mandatory snap-y h-dvh">
      <section className="grid min-h-dvh grid-cols-1 grid-rows-[auto,1fr,auto] snap-start">
        <div className="sticky top-0 bg-background z-10 py-4 border-b">
          <InfiniteText text="พื้นที่ขอเพลง" />
        </div>
        <section
          className={cn("flex justify-center items-center overflow-clip px-0")}>
          <SongList initData={song} />
        </section>
        <RequestSongInputForm />
      </section>
      {/* <section className="bg-primary min-h-dvh text-primary-foreground snap-start">
        test
      </section> */}
    </main>
  );
}
