import {ClearSongForm} from "@/components/client/clearSong";
import SongList from "@/components/list/index";
import prisma from "@/lib/prisma";
import {cn} from "@/lib/utils";

const AdminPage = async () => {
  const song = await prisma.song.findMany({
    orderBy: {
      createAt: "asc",
    },
  });

  return (
    <main className="grid min-h-dvh grid-cols-1 grid-rows-[auto,1fr]">
      <section className="p-4 border-b sticky top-0 z-10 bg-background">
        <ClearSongForm />
      </section>

      <section
        className={cn("flex justify-center items-center px-0 overflow-clip")}>
        <SongList initData={song} type="admin" />
      </section>
    </main>
  );
};

export default AdminPage;
