export const handleCustomError = (error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message); // Log the error if needed
    throw new Error(error.message);
  }
  throw new Error("An unknown error occurred");
};
