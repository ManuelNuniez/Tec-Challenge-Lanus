import { cn } from "cn";
import type { LogoProps } from "./logo-monogram";

// The original placeholder from the Figma: a plain rounded granate square.
export function LogoSquare({ size = 56, className, ...props }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="GranaBank"
      className={cn("shrink-0", className)}
      {...props}
    >
      <rect width="64" height="64" rx="14" className="fill-primary" />
    </svg>
  );
}
