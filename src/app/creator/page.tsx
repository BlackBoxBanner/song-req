import {
  createLiveSession,
  getLiveSessionFromUsersName,
  getUserByName,
} from "@/components/action/admin";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import { notFound, redirect } from "next/navigation"; // Use redirect for navigation handling
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import OuterCreatorMenu from "@/components/client/menu/creatorMenu";
import CreateDefaultSessionForm from "@/components/client/createDefaultSession";

const CreatorPage = async () => {
  // Fetch the session from the server
  const session = await useSession();

  // If there's no session or the user's name is not present, redirect to the home page
  if (!session?.user?.name) {
    return redirect("/");
  }

  const name = session.user.name;

  const liveSession = await getLiveSessionFromUsersName(name);
  const user = await getUserByName(name);

  if (!user) return notFound();

  return (
    <>
      <main className={cn("h-dvh bg-background p-4 flex flex-col gap-4")}>
        <OuterCreatorMenu userId={user.id} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
          {liveSession.length === 0 && <CreateDefaultSessionForm user={user} />}
          {liveSession.map(({ sessions }) => {
            return sessions.map(({ liveSession }) => {
              return (
                <Link href={`/creator/${liveSession.id}`}>
                  <Card key={liveSession.id} className="relative h-min">
                    <CardHeader>
                      <CardTitle className="capitalize truncate">
                        {liveSession.name}
                      </CardTitle>
                      <CardDescription>
                        {/* Display the session creation date */}
                        Created at:{" "}
                        {format(new Date(liveSession.createAt), "PPpp")}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      {/* Indicate if the session is live with a status icon */}
                      {liveSession.live && (
                        <div className="absolute top-6 right-3 flex flex-col gap-2">
                          <div className="relative flex justify-center items-center">
                            <div className="absolute w-2 h-2 bg-red-700 rounded-full" />
                            <div className="absolute w-4 h-4 bg-red-700 opacity-60 rounded-full animate-ping" />
                          </div>
                          <p className="text-red-700 text-sm">Live</p>
                        </div>
                      )}

                      {/* Display live session details */}
                      <p>
                        <strong>Limit:</strong> {liveSession.limit} songs
                      </p>
                      <p>
                        <strong>Allow Requests:</strong>{" "}
                        {liveSession.allowRequest ? "Yes" : "No"}
                      </p>
                      <p>
                        <strong>Route:</strong> {liveSession.route}
                      </p>
                    </CardContent>

                    <CardFooter>
                      {liveSession.participants.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold">Participants:</h4>
                          <ul className="list-disc pl-5">
                            {liveSession.participants.map(
                              ({ liveParticipant: participant }) => (
                                <li key={participant.id}>
                                  {participant.User.name}{" "}
                                  {participant.userId ===
                                    liveSession.createBy && "(Host)"}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                </Link>
              );
            });
          })}
        </div>
      </main>
    </>
  );
};

export default CreatorPage;
