'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background px-4 text-center">
      <AlertCircle className="mb-4 h-16 w-16 text-destructive" />
      <h2 className="mb-2 text-3xl font-bold tracking-tight">Something went wrong!</h2>
      <p className="mb-8 text-lg text-muted-foreground">
        We encountered an error while processing your request.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
