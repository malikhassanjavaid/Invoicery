import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  iconSize?: "sm" | "md" | "lg";
};

export function BrandLogo({ href = "/", iconSize = "md" }: BrandLogoProps) {
  const sizes = {
    sm: {
      icon: "size-11",
      text: "text-2xl",
      gap: "gap-3",
    },
    md: {
      icon: "size-12",
      text: "text-[28px]",
      gap: "gap-3",
    },
    lg: {
      icon: "size-[60px]",
      text: "text-[34px]",
      gap: "gap-3",
    },
  }[iconSize];

  return (
    <Link href={href} className={`inline-flex items-center ${sizes.gap}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className={`${sizes.icon} shrink-0`}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="64" height="64" rx="18" fill="#0457FF" />
        <path
          d="M21 15h17.5L48 24.5V48H21a4 4 0 0 1-4-4V19a4 4 0 0 1 4-4Z"
          fill="white"
        />
        <path d="M38.5 15v9.5H48" fill="#DCEBFF" />
        <path
          d="M25 31h14M25 38h9"
          stroke="#6EA2FF"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle cx="44" cy="44" r="12" fill="#0457FF" stroke="white" strokeWidth="4" />
        <path
          d="m38.8 44.3 3.6 3.6 7.1-7.3"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={`${sizes.text} font-bold leading-none tracking-[-0.055em]`}>
        <span className="text-[var(--brand-logo-primary,#0457ff)]">Invoice</span>
        <span className="text-[var(--brand-logo-secondary,#111827)]">ry</span>
      </span>
    </Link>
  );
}
