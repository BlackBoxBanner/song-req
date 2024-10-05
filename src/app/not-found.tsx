import { Button } from "@/components/ui/button"; // Importing the Button component from your UI library
import Link from "next/link"; // Importing the Link component from Next.js

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-dvh bg-background p-16">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        404
      </h1>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Page Not Found
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6 mb-6 text-center">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/">
        <Button>Go back to Home</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
