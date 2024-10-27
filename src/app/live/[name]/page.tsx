import { fetchLiveSessionByRoute } from "@/action/fetchLiveSessionByRoute";
import { LiveStatus } from "@/components/client/live";
import SongRequestForm from "@/components/client/songRequestForm";
import UserSongTable from "@/components/client/table/userSongTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const LivePage = async ({ params }: { params: { name: string } }) => {
  const liveSessionPromise = fetchLiveSessionByRoute(params.name);

  return (
    <>
      <main className="bg-background h-dvh p-4 gap-4 grid grid-cols-1 grid-rows-[auto,1fr,auto]">
        {/* Top: Auto Height */}
        <Suspense fallback={<Skeleton className="w-full h-[35px]" />}>
          <LiveStatus LiveSessionPromise={liveSessionPromise} />
        </Suspense>
        {/* Middle: Takes full available height */}
        <Suspense fallback={<UserSongTableSkeleton />}>
          <UserSongTable LiveSessionPromise={liveSessionPromise} />
        </Suspense>
        {/* Bottom: Auto Height */}
        <Suspense fallback={<div className="flex space-x-4"><Skeleton className="w-full h-[35px]" /> <Skeleton className="w-24 h-[35px]" /></div>}>
          <SongRequestForm LiveSessionPromise={liveSessionPromise} />
        </Suspense>
      </main>
    </>
  );
};

const UserSongTableSkeleton = () => {
  const getRandomInt = (min: number, max: number) => {
    // Ensure min and max are integers
    min = Math.ceil(min); // Round up to the nearest integer
    max = Math.floor(max); // Round down to the nearest integer
    return Math.floor(Math.random() * (max - min + 1)) + min; // Generate random integer
  };

  const TableCellSkeleton = () => {
    const randomWidth = getRandomInt(20, 80); // Generate random width

    return (
      <Skeleton className={cn(`w-[${randomWidth}px] h-4`)} />
    );
  };

  return (
    <Table className="col-span-2">
      <TableHeader>
        <TableRow className="sticky top-0 z-10 bg-background">
          <TableHead className="w-[40px]"></TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Timestamp</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: getRandomInt(3, 10) }).map((_, index) => (
          <TableRow
            key={index}
            className={cn(
              "relative",
            )}
          >
            <TableCell className="font-medium">
              {index + 1}
            </TableCell>
            <TableCell> <TableCellSkeleton /></TableCell>
            <TableCell className="text-right">
              <Skeleton className="w-20 h-4 place-self-end" />
            </TableCell>
            <TableCell className="text-right w-2">
              <Skeleton className="w-6 h-4" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default LivePage;
