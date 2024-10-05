"use client";

import { signOutAction } from "@/components/action/auth";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forwardRef, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  createLiveSession,
  getAllUniqueRoutes,
} from "@/components/action/admin";

type CreatorMenuProps = {
  userId: string;
};

const CreatorMenu = ({ userId }: CreatorMenuProps) => {
  const createSessionDialogRefBtn = useRef<HTMLButtonElement>(null);

  const handleSignOut = async () => {
    try {
      await signOutAction();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <CreateSessionDialog userId={userId} ref={createSessionDialogRefBtn} />
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Account</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={handleSignOut}>Sign out</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Session</MenubarTrigger>
          <MenubarContent>
            <MenubarItem
              onClick={() => createSessionDialogRefBtn.current?.click()}
            >
              Create new session
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </>
  );
};

export default CreatorMenu;

type CreateSessionDialogProps = {
  userId: string;
};

const CreateSessionDialog = forwardRef<
  HTMLButtonElement,
  CreateSessionDialogProps
>((props, ref) => {
  const createSessionSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    limit: z.string().default("10"),
    route: z
      .string()
      .min(3, "Route must be at least 3 characters long")
      .refine((route) => !uniqueRoutes.includes(route), "Route already exists"),
  });

  type CreateSessionFormValues = z.infer<typeof createSessionSchema>;

  const [uniqueRoutes, setUniqueRoutes] = useState<string[]>([]);
  const closeDialogRefBtn = useRef<HTMLButtonElement>(null);
  const form = useForm<CreateSessionFormValues>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      name: "",
      limit: "10",
      route: Math.random().toString(36).substr(2, 5),
    },
  });

  function onSubmit(values: CreateSessionFormValues) {
    createLiveSession({
      name: values.name,
      limit: values.limit,
      route: values.route,
      createdBy: props.userId,
    }).finally(() => {
      closeDialogRefBtn.current?.click();
    });
  }

  useEffect(() => {
    getAllUniqueRoutes().then((data) => {
      setUniqueRoutes(data.map((route) => route.route));
    });
  }, []);

  return (
    <Dialog>
      <DialogTrigger className="hidden" ref={ref} />
      <DialogContent className="max-h-[90dvh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Creating new live session</DialogTitle>
          <DialogDescription>
            This action will create a new live session. Are you sure you want to
            proceed?
          </DialogDescription>
        </DialogHeader>
        <DialogClose ref={closeDialogRefBtn} className="hidden" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Session Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be the name of the live session.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Limit */}
            <FormField
              control={form.control}
              name="limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limit</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Limit" {...field} />
                  </FormControl>
                  <FormDescription>
                    The number of participants allowed in this session.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Route */}
            <FormField
              control={form.control}
              name="route"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route</FormLabel>
                  <FormControl>
                    <Input placeholder="Session route" {...field} />
                  </FormControl>
                  <FormDescription>
                    {`Define the session's route (e.g., xyz).`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Create</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

CreateSessionDialog.displayName = "CreateSessionDialog";
