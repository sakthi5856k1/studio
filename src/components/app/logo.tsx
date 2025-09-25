import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <Image
      src="https://placehold.co/200x200/3B82F6/FFFFFF/png?text=TP"
      alt="Tamil Pasanga Logo"
      width={size}
      height={size}
      className={cn("object-contain", className)}
      unoptimized
    />
  );
}
