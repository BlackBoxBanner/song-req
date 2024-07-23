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
          <InfiniteScroll />
        </div>
        <section
          className={cn("flex justify-center items-center overflow-clip px-0")}>
          <SongList initData={song} />
        </section>
        <section
          className={cn(
            "flex justify-center items-center sticky bottom-0 bg-background p-4 border-t"
          )}>
          <RequestSongInputForm />
        </section>
      </section>
      {/* <section className="bg-primary min-h-dvh text-primary-foreground snap-start">
        test
      </section> */}
    </main>
  );
}

const InfiniteScroll = () => {
  return (
    <div className="w-full inline-flex flex-nowrap overflow-hidden ">
      <ul className="text-nowrap flex items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none animate-infinite-scroll">
        <li>พื้นที่ขอเพลง</li>
        <li>พื้นที่ขอเพลง</li>
        <li>พื้นที่ขอเพลง</li>
        <li>พื้นที่ขอเพลง</li>
        <li>พื้นที่ขอเพลง</li>
        <li>พื้นที่ขอเพลง</li>
        <li>พื้นที่ขอเพลง</li>
        <li>พื้นที่ขอเพลง</li>
        <li>พื้นที่ขอเพลง</li>
        <li>พื้นที่ขอเพลง</li>
      </ul>
      <ul
        className="text-nowrap flex items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none animate-infinite-scroll"
        aria-hidden="true">
        <li>พื้นที่ขอเพลง</li>
        <li>พื้นที่ขอเพลง</li>
        <li>พื้นที่ขอเพลง</li>
        <li>พื้นที่ขอเพลง</li>
        <li>พื้นที่ขอเพลง</li>
        <li>พื้นที่ขอเพลง</li>
        <li>พื้นที่ขอเพลง</li>
        <li>พื้นที่ขอเพลง</li>
        <li>พื้นที่ขอเพลง</li>
        <li>พื้นที่ขอเพลง</li>
      </ul>
    </div>
  );
};
