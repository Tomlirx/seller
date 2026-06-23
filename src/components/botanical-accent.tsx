export function BotanicalAccent({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={`h-10 w-10 text-jade-deep ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      opacity={0.6}
    >
      <path d="M10,70 C18,50 32,38 50,30" />
      <path d="M50,30 C54,24 56,18 54,12" />
      <path d="M50,30 C58,28 66,24 70,16" />
      <path d="M34,46 C28,40 24,32 25,24" />
    </svg>
  );
}
