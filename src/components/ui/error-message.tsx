import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <p
      className={cn(
        'text-sm font-medium text-destructive mt-1',
        className
      )}
      role="alert"
    >
      {message}
    </p>
  );
}

