import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";

const SignOutButton = () => {
  const signOutAction = async () => {
    "use server";
    await signOut();
  };
  return (
    <form action={signOutAction}>
      <Button className="w-full" type="submit">
        Sign Out
      </Button>
    </form>
  );
};

export default SignOutButton;
