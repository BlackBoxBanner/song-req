import { getUser } from "@/components/action/admin";
import SongRequestForm from "@/components/client/songRequestForm";
import UserSongTable from "@/components/client/table/userSongTable";
import { redirect } from "next/navigation";

const LivePage = async ({ params }: { params: { name: string } }) => {
  const user = await getUser(params.name, true);

  if (!user) return redirect("/");

  return (
    <>
      <main className="grid grid-cols-1 grid-rows-[1fr,auto] h-dvh p-2 gap-2 relative divide-y">
        <UserSongTable songs={user.Song} />
        <SongRequestForm
          live={user.live}
          name={params.name}
          limit={user.limit}
        />
      </main>
    </>
  );
};

export default LivePage;
