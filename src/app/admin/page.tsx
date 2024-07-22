import activateSessionAction from "@/action/activateSession";
import deactivateSessionAction from "@/action/deactivateSession";
import SongList from "@/components/list/index";
import {Button} from "@/components/ui/button";
import prisma from "@/lib/prisma";
import {cn} from "@/lib/utils";

const AdminPage = async () => {
  const session = (await prisma.session.findMany())[0];
  return (
    <main className={cn("min-h-dvh h-dvh flex p-2 flex-col gap-4 relative")}>
      {session ? (
        <>
          <DeactivateSession />
          <SongList
            socket={session.socket}
            type="admin"
            initialCountDownTime={5}
          />
        </>
      ) : (
        <>
          <ActivateSession />
        </>
      )}
    </main>
  );
};

export default AdminPage;

const ActivateSession = async () => {
  return (
    <form action={activateSessionAction} className="w-full h-full">
      <Button className="w-full h-full text-4xl" type="submit">
        เปิดห้อง
      </Button>
    </form>
  );
};

const DeactivateSession = async () => {
  return (
    <form action={deactivateSessionAction}>
      <Button className="w-full" type="submit">
        ปิดห้อง
      </Button>
    </form>
  );
};
