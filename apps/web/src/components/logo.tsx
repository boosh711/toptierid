import Image from "next/image";
import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex shrink-0 items-center ${className}`}>
      <Image
        src="/logo.png"
        alt="TOP TIER ID"
        width={1024}
        height={156}
        className="h-9 w-auto"
        priority
      />
    </Link>
  );
}
