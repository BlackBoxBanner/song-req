import activateSessionAction from "@/action/activateSession";
import deactivateSessionAction from "@/action/deactivateSession";
import SongList from "@/components/list/index";
import {Button} from "@/components/ui/button";
import prisma from "@/lib/prisma";
import {cn} from "@/lib/utils";

const AdminPage = async () => {
  const sessions = await prisma.session.findMany();

  if (sessions.length <= 0)
    return (
      <main className={cn("min-h-dvh h-dvh flex p-2 flex-col gap-4 relative")}>
        <ActivateSession />
      </main>
    );

  const song = await prisma.song.findMany();

  return (
    <main className={cn("min-h-dvh h-dvh flex p-2 flex-col gap-4 relative")}>
      <DeactivateSession />
      <SongList type="admin" initData={song} />
    </main>
  );
};

const ActivateSession = () => (
  <form action={activateSessionAction} className="w-full h-full">
    <Button className="w-full h-full text-4xl" type="submit">
      เปิดห้อง
    </Button>
  </form>
);

const DeactivateSession = () => (
  <form action={deactivateSessionAction}>
    <Button className="w-full" type="submit">
      ปิดห้อง
    </Button>
  </form>
);

export default AdminPage;
