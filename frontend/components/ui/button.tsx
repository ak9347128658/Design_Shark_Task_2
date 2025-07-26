// Button Component
"use client";

import React from "react";
import { cn } from "./utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "danger" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg cursor-pointer";

    const variants = {
      primary:
        "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 shadow-md",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground border border-border hover:border-ring hover:shadow-md hover:-translate-y-0.5",
      outline:
        "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground hover:border-ring hover:shadow-md hover:-translate-y-0.5",
      ghost:
        "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
      link: 
        "bg-transparent text-primary hover:underline hover:text-primary/80 p-0 h-auto font-normal underline-offset-4",
      danger:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg hover:-translate-y-0.5 shadow-md border border-destructive hover:border-destructive/80",
      success:
        "bg-success text-success-foreground hover:bg-success/90 hover:shadow-lg hover:-translate-y-0.5 shadow-md border border-success hover:border-success/80",
      warning:
        "bg-warning text-warning-foreground hover:bg-warning/90 hover:shadow-lg hover:-translate-y-0.5 shadow-md border border-warning hover:border-warning/80",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm rounded-md",
      md: "h-10 px-4 py-2 rounded-lg",
      lg: "h-12 px-6 py-3 text-lg rounded-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isLoading && "cursor-wait",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
