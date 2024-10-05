"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button"; // Importing the Button component from your UI library
import { useEffect } from "react"; // Importing useEffect for handling side effects

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }; // Defining the type for error
  reset: () => void; // Function to reset the error boundary
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-dvh bg-background p-16">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Oops!
      </h1>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Something went wrong
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6 mb-6 text-center">
        We&apos;re sorry, but there was an error processing your request. Please try
        again.
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
