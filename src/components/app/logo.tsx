import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <Image
      src="https://media.discordapp.net/attachments/812969396540145694/1419200715330687076/logo.png?ex=68d3882a&is=68d236aa&hm=889022d1a96d01393df693e2ad7e6a217c783242db8909113050254122422a90&=&format=webp&quality=lossless"
      alt="Tamil Pasanga Logo"
      width={size}
      height={size}
      className={cn(className)}
    />
  );
}
