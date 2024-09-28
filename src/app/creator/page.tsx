import { getUser } from "@/components/action/admin";
import CreatorMenu from "@/components/client/menu/creator";
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
          "grid grid-cols-1 grid-rows-[auto,1fr] h-dvh bg-background "
        )}
      >
        <CreatorMenu live={user.live} name={user.name} limit={user.limit} />
        {/* Admin Song Table */}
        <div className="overflow-auto lg:h-dvh p-2 relative">
          <AdminSongTable songs={user.Song} name={user.name!} />
        </div>
      </main>
    </>
  );
};

export default CreatorPage;
