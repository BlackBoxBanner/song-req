import { getUser } from "@/components/action/admin";
import { DeleteForm } from "@/components/client/deleteSong";
import { LimitForm } from "@/components/client/limitForm";
import { ChangeLiveForm, LiveStatus } from "@/components/client/live";
import SignOutButton from "@/components/client/signoutForm";
import AdminSongTable from "@/components/client/table/adminSongTable";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import { permanentRedirect } from "next/navigation";

const CreatorPage = async () => {
  const session = await useSession();

  const name = session.user?.name;

  if (!name) return permanentRedirect("/");

  const user = await getUser(name, true);

  if (!user) return null;

  return (
    <main
      className={cn(
        "grid grid-cols-1 grid-rows-[auto,1fr] lg:grid-rows-1 lg:grid-cols-2 h-dvh bg-background"
      )}
    >
      <div className={cn("grid grid-cols-2 row-auto h-fit gap-2 p-2")}>
        <div className="col-span-2 grid grid-cols-2">
          <LiveStatus live={user.live} />
        </div>
        <SignOutButton />
        <ChangeLiveForm name={user.name} live={user.live} />
        <DeleteForm name={user.name} />
        <LimitForm name={user.name} limit={user.limit} />
      </div>
      <div className="overflow-auto lg:h-dvh p-2 relative">
        <AdminSongTable songs={user.Song} />
      </div>
    </main>
  );
};

export default CreatorPage;
