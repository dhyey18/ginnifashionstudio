import type { CSSProperties } from "react";

interface ProductImageProps {
  color: string;
  pattern: string;
  name: string;
  className?: string;
}

type WithCustomProps = CSSProperties & Record<`--${string}`, string>;

export function ProductImage({
  color,
  pattern,
  name,
  className = "",
}: ProductImageProps) {
  const style: WithCustomProps = { "--prod-base": color };

  return (
    <div
      className={`g-prod-img is-${pattern} ${className}`}
      style={style}
      role="img"
      aria-label={name}
    />
  );
}
