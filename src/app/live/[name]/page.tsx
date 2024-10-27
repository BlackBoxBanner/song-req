import { fetchLiveSessionByRoute } from "@/action/fetchLiveSessionByRoute";
import { LiveStatus } from "@/components/client/live";
import SongRequestForm from "@/components/client/songRequestForm";
import UserSongTable from "@/components/client/table/userSongTable";
import { notFound } from "next/navigation";

const LivePage = async ({ params }: { params: { name: string } }) => {
  const liveSession = await fetchLiveSessionByRoute(params.name);

  if (!liveSession) return notFound();

  return (
    <>
      <main className="bg-background h-dvh p-4 gap-4 grid grid-cols-1 grid-rows-[auto,1fr,auto]">
        {/* Top: Auto Height */}
        <LiveStatus LiveSession={liveSession} />
        {/* Middle: Takes full available height */}
        <UserSongTable LiveSession={liveSession} />
        {/* Bottom: Auto Height */}
        <SongRequestForm LiveSession={liveSession} />
      </main>
    </>
  );
};

export default LivePage;
