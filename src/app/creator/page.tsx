import { Button } from "@/components/ui/button";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { signOut } from "@/lib/auth";
import { cn } from "@/lib/utils";

const CreatorPage = () => {
  const signOutAction = async () => {
    "use server";
    await signOut();
  };
  return (
    <main
      className={cn(
        "grid grid-cols-1 grid-rows-[auto,1fr] lg:grid-rows-1 lg:grid-cols-2 h-dvh bg-background p-2 gap-2",
      )}
    >
      <div>
        <h1 className="text-lg">Creator Page</h1>
        <form action={signOutAction}>
          <Button type="submit">Sign Out</Button>
        </form>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableHead>
              <TableCell>First Name</TableCell>
            </TableHead>
          </TableHeader>
        </Table>
      </div>
    </main>
  );
};

export default CreatorPage;
