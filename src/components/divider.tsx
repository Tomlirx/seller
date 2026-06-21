export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-10 bg-line" />
      <span className="h-1 w-1 rounded-full bg-gold" />
      <span className="h-px w-10 bg-line" />
    </div>
  );
}
