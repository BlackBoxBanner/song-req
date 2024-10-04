import { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type LiveParticipantsListProps = {
  liveParticipant: User[];
};
const LiveParticipantsList = ({
  liveParticipant,
}: LiveParticipantsListProps) => {
  return liveParticipant.map((user) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar key={user.id}>
            <AvatarImage src="https://avatar.iran.liara.run/public" />
            <AvatarFallback>{user.name?.split("", 2)}</AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>
          <p>{user.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ));
};

export default LiveParticipantsList;
