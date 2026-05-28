import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`font-display text-xl tracking-tight ${className}`}>
      <span className="text-navy">TOP T</span>
      <span className="text-brand">1</span>
      <span className="text-navy">ER</span>
      <span className="ml-1 rounded bg-brand px-1.5 py-0.5 text-sm text-white">ID</span>
    </Link>
  );
}
