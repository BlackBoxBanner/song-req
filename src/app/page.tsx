import requestSongAction from "@/action/requestSong";
import SongList from "@/components/list";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";

export default async function Home() {
  return (
    <main className="grid min-h-dvh grid-cols-1 grid-rows-[1fr,auto]">
      <section
        className={cn("flex justify-center items-center", "p-4 order-last")}>
        <form action={requestSongAction} className="flex flex-col gap-2 w-full">
          <Input name="song-name" placeholder={"ชื่อเพลง ..."} />
          <Button type="submit">ขอเพลง</Button>
        </form>
      </section>
      <section className={cn("flex justify-center items-center", "p-4")}>
        <SongList />
      </section>
    </main>
  );
}
