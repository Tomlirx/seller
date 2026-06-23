export function PageContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto max-w-[1600px] w-full px-6 sm:px-20 ${className}`}>{children}</div>;
}
