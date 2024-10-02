import {
  getUserById,
  getLiveSessionFromUsersName,
} from "@/components/action/admin";
import CreatorMenu from "@/components/client/menu/creator";
import AdminSongTable from "@/components/client/table/adminSongTable";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation"; // Use redirect for navigation handling
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CreatorPage = async () => {
  // Fetch the session from the server
  const session = await useSession();

  // If there's no session or the user's name is not present, redirect to the home page
  if (!session?.user?.name) {
    return redirect("/");
  }

  const name = session.user.name;

  const liveSession = await getLiveSessionFromUsersName(name);

  // // Fetch the user data based on the session name
  // const user = await getUser(name, true);

  // // If the user doesn't exist, return null to avoid rendering the page
  // if (!user) return null;

  return (
    <>
      <main className={cn("h-dvh bg-background flex flex-col gap-4 p-4")}>
        {liveSession.map(({ LiveSession: liveSession }, index) => {
          return (
            <Card key={liveSession.id} className="relative">
              <CardHeader>
                <CardTitle>{liveSession.name}</CardTitle>
                {/* <CardDescription>Card Description</CardDescription> */}
              </CardHeader>
              <CardContent>
                {liveSession.live && (
                  <div className="absolute top-4 right-4 flex flex-col">
                    <div className="relative flex justify-center items-center">
                      <div className="absolute w-2 h-2 bg-lime-400 rounded-full" />
                      <div className="absolute w-4 h-4 bg-lime-400 opacity-60 rounded-full animate-ping" />
                    </div>
                  </div>
                )}
                <pre>{JSON.stringify(liveSession, null, 2)}</pre>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          );
        })}

        {/* <CreatorMenu live={user.live} name={user.name} limit={user.limit} /> */}
        {/* Admin Song Table */}
        {/* <div className="overflow-auto lg:h-dvh p-2 relative">
          <AdminSongTable songs={user.Song} name={user.name!} />
        </div> */}
      </main>
    </>
  );
};

export default CreatorPage;
