import {ClearSongForm} from "@/components/client/clearSong";
import SongList from "@/components/list/index";
import prisma from "@/lib/prisma";
import {cn} from "@/lib/utils";

const AdminPage = async () => {
  const song = await prisma.song.findMany();
  return (
    <main className={cn("min-h-dvh h-dvh flex p-2 flex-col gap-4 relative")}>
      <ClearSongForm />
      <SongList type="admin" initData={song} />
    </main>
  );
};

export default AdminPage;
