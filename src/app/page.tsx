import RequestSongInputForm from "@/components/client/reqInput";
import SongList from "@/components/list";
import prisma from "@/lib/prisma";
import {cn} from "@/lib/utils";

export default async function Home() {
  const sessions = await prisma.session.findMany();

  if (sessions.length <= 0)
    return (
      <div className="flex justify-center items-center text-2xl">
        ช่วงเวลาของการขอเพลงยังไม่เปิด...
      </div>
    );

  const session = sessions[sessions.length - 1];

  const song = await prisma.song.findMany();

  return (
    <main className="grid min-h-dvh grid-cols-1 grid-rows-[auto,1fr,auto] gap-6 p-4">
      <InfiniteScroll />
      <section className={cn("flex justify-center items-center")}>
        <SongList initData={song} />
      </section>
      <section className={cn("flex justify-center items-center")}>
        <RequestSongInputForm session={session} />
      </section>
    </main>
  );
}

const InfiniteScroll = () => {
  return (
    <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
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
