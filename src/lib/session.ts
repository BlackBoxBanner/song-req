import { permanentRedirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const useSession = async () => {
  const session = await auth();
  if (!session) permanentRedirect("/");
  return session;
};
