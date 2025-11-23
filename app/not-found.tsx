import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-background px-4 text-center">
      <FileQuestion className="mb-4 h-16 w-16 text-muted-foreground" />
      <h2 className="mb-2 text-3xl font-bold tracking-tight">Page Not Found</h2>
      <p className="mb-8 text-lg text-muted-foreground">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
