import SignInForm from "@/components/client/signinForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const LoginPage = () => {
  return (
    <main
      className={cn("bg-background h-dvh flex justify-center items-center")}
    >
      <Card className="w-full max-w-96 m-2">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </main>
  );
};

export default LoginPage;
