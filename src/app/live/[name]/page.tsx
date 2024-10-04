import { getLiveSessionByRoute } from "@/components/action/admin";
import { LiveStatus } from "@/components/client/live";
import SongRequestForm from "@/components/client/songRequestForm";
import UserSongTable from "@/components/client/table/userSongTable";
import { notFound } from "next/navigation";

const LivePage = async ({ params }: { params: { name: string } }) => {
  const liveSession = await getLiveSessionByRoute(params.name);

  if (!liveSession) return notFound();

  return (
    <>
      <main className="bg-background h-dvh p-4 gap-4 grid grid-cols-1 grid-rows-[auto,1fr,auto]">
        {/* Top: Auto Height */}
        <LiveStatus live={liveSession.live} id={liveSession.id} />

        {/* Middle: Takes full available height */}
        <UserSongTable songs={liveSession.Song} />

        {/* Bottom: Auto Height */}
        <SongRequestForm
          live={liveSession.live}
          id={liveSession.id}
          limit={liveSession.limit}
          allowRequest={liveSession.allowRequest}
        />
      </main>
    </>
  );
};

export default LivePage;
