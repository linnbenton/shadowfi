"use client";

import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "primary" | "neon" | "danger";

type Props = {
  variant?: Variant;
  loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  variant = "primary",
  loading = false,
  className,
  disabled,
  ...props
}: Props) {
  const base =
    "px-4 py-2 text-xs font-bold rounded transition-all duration-200 cursor-pointer";

  const styles = {
    primary:
      "bg-gradient-to-r from-cyan-400 to-purple-500 text-black hover:opacity-90",

    neon: "border border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 shadow-[0_0_10px_rgba(0,255,255,0.4)]",

    danger: "bg-red-600 text-white hover:bg-red-500",
  };

  return (
    <button
      className={clsx(
        base,
        styles[variant],
        (disabled || loading) && "opacity-40 cursor-not-allowed",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Processing..." : children}
    </button>
  );
}
