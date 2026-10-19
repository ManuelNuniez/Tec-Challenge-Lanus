import type { SVGProps } from "react";
import { cn } from "cn";

export type LogoProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// GranaBank "G" on the rounded granate square from the Figma.
export function LogoMonogram({ size = 56, className, ...props }: LogoProps) {
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
      <path
        d="M41.9 22.1 A14 14 0 1 0 46 32 H33"
        fill="none"
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
