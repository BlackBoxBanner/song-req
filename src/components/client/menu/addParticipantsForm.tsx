"use client";

import { LiveSession, User } from "@prisma/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchAllUsers } from "@/action/fetchAllUsers";
import { addParticipantToLiveSession } from "@/action/addParticipantToLiveSession";
import { removeParticipantFromLiveSession } from "@/action/removeParticipantFromLiveSession";

type AddParticipantsFormProps = {
  liveParticipant: User[];
  createBy: LiveSession["createBy"];
  id: LiveSession["id"];
};
const AddParticipantsForm = ({
  liveParticipant,
  createBy,
  id,
}: AddParticipantsFormProps) => {
  const [users, setUsers] = useState<Pick<User, "id" | "username">[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchAllUsers().then((data) => {
      setUsers(data);
    });
  }, []);

  const handleClickParticipant = async (
    userId: string,
    method: "add" | "remove"
  ) => {
    if (method === "add") {
      await addParticipantToLiveSession(userId, id);
    } else {
      await removeParticipantFromLiveSession(userId, id);
    }
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            Participants
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0 h-full">
          <Command>
            <CommandInput placeholder="Search user..." />
            <CommandList>
              <CommandEmpty>No user found.</CommandEmpty>
              <CommandGroup>
                {users.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.username!}
                    disabled={user.id === createBy}
                    onSelect={() => {
                      handleClickParticipant(
                        user.id,
                        liveParticipant.find((p) => {
                          return p.id === user.id;
                        })
                          ? "remove"
                          : "add"
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        liveParticipant.find((p) => {
                          return p.id === user.id;
                        })
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {user.username}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AddParticipantsForm;
