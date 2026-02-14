import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-[#0B132B] mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            "w-full px-4 py-2.5 border rounded-lg transition-all duration-200 bg-white",
            "focus:outline-none focus:ring-2 focus:ring-[#3FFFD9] focus:border-transparent",
            "placeholder:text-[#6B7A99]",
            error 
              ? "border-red-500 focus:ring-red-500" 
              : "border-[#E2E8F0] hover:border-[#3FFFD9]/50",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
