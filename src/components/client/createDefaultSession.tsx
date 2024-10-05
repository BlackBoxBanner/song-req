"use client";
import { Button } from "@/components/ui/button";
import { createLiveSession } from "@/components/action/admin";
import { User } from "@prisma/client";

type CreateDefaultSessionFormProps = {
  user: User;
};

const CreateDefaultSessionForm = ({ user }: CreateDefaultSessionFormProps) => {
  return (
    <div className="flex flex-col items-center justify-center col-span-2 h-96 gap-4">
      <h1 className="text-3xl font-semibold">No live sessions found</h1>
      <Button
        onClick={() =>
          createLiveSession({
            limit: "10",
            name: "Default Session",
            route: user.name ? user.name : "default",
            default: true,
            createdBy: user.id,
          })
        }
      >
        Create a new live session
      </Button>

      <p className="text-sm mt-2">
        You can create a new live session by clicking the button above
      </p>
    </div>
  );
};

export default CreateDefaultSessionForm;
