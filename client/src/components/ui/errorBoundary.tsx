/**
 * Global Error Boundary - WCAG 2.1 compliant error handling.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);

    // Log to monitoring service
    if (typeof console !== "undefined") {
      console.error("[ErrorBoundary]", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          role="alert"
          className={cn(
            "flex flex-col items-center justify-center p-8 text-center",
            "rounded-xl border bg-white shadow-md"
          )}
          style={{ minHeight: "300px" }}
        >
          <div className="rounded-full bg-error-50 p-4">
            <AlertTriangle className="size-8 text-error-600" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-neutral-900">
            حدث خطأ غير متوقع
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            تعذر تحميل هذا المحتوى. يرجى المحاولة مرة أخرى.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null, errorInfo: null });
              window.location.reload();
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-600"
          >
            <RefreshCw className="size-4" />
            إعادة التحميل
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Inline Error Display - For form validation and API errors.
 */
interface InlineErrorProps {
  message: string;
  className?: string;
}

export function InlineError({ message, className }: InlineErrorProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-center gap-2 rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-sm text-error-700",
        className
      )}
    >
      <AlertTriangle className="size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
