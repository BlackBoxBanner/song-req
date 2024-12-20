import { notFound, redirect } from "next/navigation";
import AdminSongTable from "@/components/client/table/adminSongTable";
import LiveSessionMenu from "@/components/client/menu/liveSessionMenu";
import StatusBadgeBar from "@/components/client/statusBadgeBar";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import { fetchUserByUsername } from "@/action/fetchUserByUsername";
import { fetchLiveSessionById } from "@/action/fetchLiveSessionById";

const CreatorLivePage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const session = await useSession();

  // Redirect to home if no valid session
  if (!session?.user?.name) return redirect("/");

  const user = await fetchUserByUsername(session.user.name);
  if (!user) return notFound();

  const liveSession = await fetchLiveSessionById(id, true);
  if (!liveSession) return notFound();

  // Check if user is part of the live session
  const isParticipant = liveSession.participants.some(
    (p) => p.liveParticipant.User.id === user.id,
  );
  if (!isParticipant) return redirect("/creator");

  return (
    <main className="h-dvh bg-background p-4 flex flex-col gap-4">
      <div className={cn("grid items-center grid-cols-[1fr,auto]")}>
        <LiveSessionMenu
          editCount={liveSession.editCountDefault}
          live={liveSession.live}
          id={liveSession.id}
          limit={liveSession.limit}
          allowRequest={liveSession.allowRequest}
          createBy={liveSession.createBy}
          userId={user.id}
          defaultSession={liveSession.default}
          liveParticipant={liveSession.participants.map(
            (p) => p.liveParticipant.User,
          )}
          config={{
            isClearAfterLimitChange: liveSession.clearOnChangeLimit,
          }}
        />
      </div>
      <StatusBadgeBar
        id={liveSession.id}
        allowRequest={liveSession.allowRequest}
        live={liveSession.live}
        limit={liveSession.limit}
        route={liveSession.route}
      />
      <div className="overflow-auto lg:h-dvh relative">
        <AdminSongTable songs={liveSession.Song} id={liveSession.id} />
      </div>
    </main>
  );
};

export default CreatorLivePage;
