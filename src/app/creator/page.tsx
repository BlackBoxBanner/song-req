import { getUser } from "@/components/action/admin";
import { DeleteForm } from "@/components/client/deleteSong";
import { LimitForm } from "@/components/client/limitForm";
import { ChangeLiveForm, LiveStatus } from "@/components/client/live";
import SignOutButton from "@/components/client/signoutForm";
import AdminSongTable from "@/components/client/table/adminSongTable";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation"; // Use redirect for navigation handling

const CreatorPage = async () => {
  // Fetch the session from the server
  const session = await useSession();

  // If there's no session or the user's name is not present, redirect to the home page
  if (!session?.user?.name) {
    return redirect("/");
  }

  const name = session.user.name;

  // Fetch the user data based on the session name
  const user = await getUser(name, true);

  // If the user doesn't exist, return null to avoid rendering the page
  if (!user) return null;

  return (
    <>
      <main
        className={cn(
          "grid grid-cols-1 grid-rows-[auto,1fr] lg:grid-rows-1 lg:grid-cols-2 h-dvh bg-background"
        )}
      >
        <div className={cn("grid grid-cols-2 row-auto h-fit gap-2 p-2")}>
          {/* Live status component */}
          <div className="col-span-2 grid grid-cols-2">
            <LiveStatus live={user.live} name={user.name} />
          </div>

          {/* Sign out button */}
          <SignOutButton />

          {/* Change live form */}
          <ChangeLiveForm name={user.name} live={user.live} />

          {/* Delete all songs form */}
          <DeleteForm name={user.name} />

          {/* Limit form */}
          <LimitForm name={user.name} limit={user.limit} />
        </div>

        {/* Admin Song Table */}
        <div className="overflow-auto lg:h-dvh p-2 relative">
          <AdminSongTable songs={user.Song} name={user.name!} />
        </div>
      </main>
    </>
  );
};

export default CreatorPage;
