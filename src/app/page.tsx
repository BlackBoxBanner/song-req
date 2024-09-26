import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="grid grid-rows-[1fr,auto]">
      <section className="h-dvh bg-background flex justify-center items-center flex-col p-4 gap-4">
        <h1 className="text-[clamp(26px,4vw,35px)]">Song Request Platform</h1>
        <p className="text-[clamp(16px,4vw,22px)]">
          This is a song request platform where you can request songs to be
          played live.
        </p>
      </section>

      {/* Footer Section */}
      <section className="bg-primary text-primary-foreground flex flex-col md:flex-row justify-between items-center p-4 gap-4">
        {/* Left side: Copyright */}
        <div className="text-center md:text-left">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Your Name or Company. All rights
            reserved.
          </p>
        </div>

        {/* Right side: Contact information */}
        <div className="flex flex-col md:flex-row gap-2">
          <Link href="https://sueksit.vercel.app/">
            <Button variant="link" className="text-primary-foreground">My Website</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
