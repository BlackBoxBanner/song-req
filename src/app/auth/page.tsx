import SignInForm from "@/components/client/signinForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

const LoginPage = () => {
  return (
    <main
      className={cn("bg-background h-dvh flex justify-center items-center")}
    >
      <div>
        <Card className="w-full max-w-96 m-2">
          <CardHeader>
            <CardTitle>Auth</CardTitle>
            <CardDescription>
              Please sign in to your account or register to create a new one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Link href={"/auth/signin"}>
                <Button className="w-full" variant={"outline"}>
                  Sign in
                </Button>
              </Link>
              <Link href={"/auth/register"}>
                <Button className="w-full" variant={"outline"}>
                  Sign up
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default LoginPage;
