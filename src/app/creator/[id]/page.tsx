import { getLiveSessionById } from "@/components/action/admin";
import { notFound } from "next/navigation";
import AdminSongTable from "@/components/client/table/adminSongTable";
import LiveSessionMenu from "@/components/client/menu/liveSessionMenu";
import StatusBadgeBar from "@/components/client/statusBadgeBar";

const CreatorLivePage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const liveSession = await getLiveSessionById(id, true);

  if (!liveSession) return notFound();
  return (
    <>
      <main className="h-dvh bg-background p-4 flex flex-col gap-4">
        <LiveSessionMenu
          live={liveSession.live}
          id={liveSession.id}
          limit={liveSession.limit}
          allowRequest={liveSession.allowRequest}
        />
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
