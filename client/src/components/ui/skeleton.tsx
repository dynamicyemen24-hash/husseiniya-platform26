/**
 * Skeleton Loading Component - WCAG 2.1 compliant shimmer animation.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  lines?: number;
  animate?: boolean;
}

export function Skeleton({
  className,
  variant = "text",
  width,
  height,
  lines = 1,
  animate = true,
}: SkeletonProps) {
  const baseClasses = "bg-neutral-200 dark:bg-neutral-800";
  const animationClasses = animate ? "animate-pulse" : "";

  const shapeClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className="space-y-2" aria-hidden="true">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              animationClasses,
              shapeClasses.text,
              i === lines - 1 && "w-3/4"
            )}
            style={{ width: width ?? "100%", height }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        animationClasses,
        shapeClasses[variant],
        className
      )}
      style={{ width, height }}
      role="status"
      aria-label="جاري التحميل"
    >
      <span className="sr-only">جاري التحميل...</span>
    </div>
  );
}

/**
 * Card Skeleton - For loading states in data grids and lists.
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-6 space-y-4",
        "animate-pulse",
        className
      )}
      role="status"
      aria-label="جاري التحميل"
    >
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="space-y-2 flex-1">
          <Skeleton width="60%" />
          <Skeleton width="40%" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton lines={3} />
      </div>
      <span className="sr-only">جاري التحميل...</span>
    </div>
  );
}

/**
 * Table Skeleton - For loading states in data tables.
 */
export function TableSkeleton({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="space-y-3" role="status" aria-label="جاري التحميل">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className="h-4 rounded"
              width={colIndex === 0 ? "20%" : "15%"}
            />
          ))}
        </div>
      ))}
      <span className="sr-only">جاري التحميل...</span>
    </div>
  );
}

/**
 * Inline Skeleton - For loading indicators within text.
 */
export function InlineSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-4 w-24", className)} />;
}
