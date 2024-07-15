import requestSongAction from "@/action/requestSong";
import SongList from "@/components/list";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import prisma from "@/lib/prisma";
import {cn} from "@/lib/utils";

export default async function Home() {
  const session = (await prisma.session.findMany())[0];

  return (
    <main className="grid min-h-dvh grid-cols-1 grid-rows-[1fr,auto]">
      <section
        className={cn(
          "flex justify-center items-center",
          "lg:p-12 lg:order-first",
          "p-4 order-last"
        )}>
        <form
          action={requestSongAction}
          className="flex flex-col lg:gap-4 gap-2 w-full">
          <Input
            name="song-name"
            placeholder={
              session ? "ชื่อเพลง ..." : "ไม่สามารถขอเพลงได้ในตอนนี้"
            }
            disabled={!session}
          />
          <Button type="submit" disabled={!session}>
            ขอเพลง
          </Button>
        </form>
      </section>
      <section
        className={cn("flex justify-center items-center", "lg:p-12", "p-4")}>
        {!session ? "ไม่สามารถขอเพลงได้ในตอนนี้" : <SongList />}
      </section>
    </main>
  );
}
