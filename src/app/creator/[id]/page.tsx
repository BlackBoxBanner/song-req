import { getLiveSessionById, getUserByName } from "@/components/action/admin";
import { notFound, redirect } from "next/navigation";
import AdminSongTable from "@/components/client/table/adminSongTable";
import LiveSessionMenu from "@/components/client/menu/liveSessionMenu";
import StatusBadgeBar from "@/components/client/statusBadgeBar";
import { useSession } from "@/lib/session";

const CreatorLivePage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  // Fetch the session from the server
  const session = await useSession();

  // If there's no session or the user's name is not present, redirect to the home page
  if (!session?.user?.name) {
    return redirect("/");
  }

  const name = session.user.name;

  const user = await getUserByName(name);

  if (!user) return notFound();

  const liveSession = await getLiveSessionById(id, true);

  if (!liveSession) return notFound();

  if (
    user.id !==
    liveSession.participants.find((p) => p.liveParticipant.User.id === user.id)
      ?.liveParticipant.User.id
  ) {
    return redirect("/creator");
  }
  return (
    <>
      <main className="h-dvh bg-background p-4 flex flex-col gap-4">
        <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4">
          <LiveSessionMenu
            live={liveSession.live}
            id={liveSession.id}
            limit={liveSession.limit}
            allowRequest={liveSession.allowRequest}
            createBy={liveSession.createBy}
            liveParticipant={liveSession.participants.map(
              (p) => p.liveParticipant.User
            )}
          />
        </div>
        <StatusBadgeBar
          id={liveSession.id}
          allowRequest={liveSession.allowRequest}
          live={liveSession.live}
          limit={liveSession.limit}
        />
        {/* Admin Song Table */}
        <div className="overflow-auto lg:h-dvh relative">
          <AdminSongTable songs={liveSession.Song} id={liveSession.id} />
        </div>
      </main>
    </>
  );
};

export default CreatorLivePage;
