import type { ComponentPropsWithoutRef, ElementType } from "react";

type BlueprintProps<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

/** Draws "+" registration marks centred on the four corners of its box. */
export function Blueprint<T extends ElementType = "div">({
  as,
  className = "",
  ...props
}: BlueprintProps<T>) {
  const Tag = as ?? "div";
  return <Tag className={`bp ${className}`} {...props} />;
}
