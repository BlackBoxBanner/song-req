import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";

export default function Home() {
  const toLiveAction = async (formData: FormData) => {
    "use server"; // Ensure this code runs on the server
    const username = formData.get("username") as string;

    if (username.trim()) {
      // Redirect to /live/<username> if the username is valid
      redirect(`/live/${username}`);
    }
  };

  return (
    <main className="grid grid-rows-[1fr,auto] min-h-screen">
      <section className="h-dvh bg-background flex justify-center items-center flex-col p-16 gap-4">
        <h1 className="text-[clamp(26px,4vw,35px)]">Song Request Platform</h1>
        <p className="text-[clamp(16px,4vw,22px)] w-[35rem] text-center">
          {`Welcome to the Song Request Platform where creators can host live sessions, and users can request their favorite songs to be played live during those sessions. Simply enter the creator's name to join their live page and make your song requests!`}
        </p>

        {/* Form to enter creator name and route to /live/<username> */}
        <form
          action={toLiveAction} // Server action to handle the form submission
          className="flex flex-col items-center gap-4 w-full max-w-md"
        >
          <Input
            type="text"
            name="username"
            placeholder="Enter creator's username"
            required
          />
          <Button type="submit" className="w-full">
            Go to Live Page
          </Button>
        </form>
      </section>

      {/* Footer Section */}
      <section className="bg-primary text-primary-foreground flex flex-col md:flex-row justify-between items-center p-4 gap-4">
        {/* Left side: Copyright */}
        <div className="text-center md:text-left">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Sueksit Vachirakumthorn. All
            rights reserved.
          </p>
        </div>

        {/* Right side: Contact information */}
        <div className="flex flex-col md:flex-row gap-2">
          <Link href="https://sueksit.vercel.app/">
            <Button variant="link" className="text-primary-foreground">
              My Website
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
