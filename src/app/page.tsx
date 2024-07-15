import requestSongAction from "@/action/requestSong";
import SongList from "@/components/list";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import prisma from "@/lib/prisma";
import {cn} from "@/lib/utils";

export default async function Home() {
  const session = (await prisma.session.findMany())[0];

  return (
    <main className="grid min-h-dvh grid-cols-1 grid-rows-[auto,1fr,auto] gap-6 p-4">
      <p>{!session ? "ยังไม่สามารถขอเพลงได้" : "สามารถขอเพลงได้"}</p>
      <section className={cn("flex justify-center items-center")}>
        <SongList />
      </section>
      <section className={cn("flex justify-center items-center")}>
        <form action={requestSongAction} className="flex flex-col gap-2 w-full">
          <Input name="song-name" placeholder={"ชื่อเพลง ..."} />
          <Button type="submit">ขอเพลง</Button>
        </form>
      </section>
    </main>
  );
}
