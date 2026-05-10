"use client";

import type { ReactNode } from "react";
import type { ToppingPlacement } from "@/lib/cart-types";

type SelectionAccent = "ember" | "red";

type PlacementToggleProps = {
  /** `null`: no option appears selected. */
  value: ToppingPlacement | null;
  /**
   * `next` is the new placement, or `null` when the user clicks the already-selected
   * control to clear it. When `next` is `null`, `toggledOff` is that placement.
   */
  onChange: (
    next: ToppingPlacement | null,
    toggledOff?: ToppingPlacement,
  ) => void;
  idPrefix?: string;
  compact?: boolean;
  /** Highlight color for the selected control + icon. */
  selectionAccent?: SelectionAccent;
};

const ACCENT: Record<
  SelectionAccent,
  { stroke: string; fill: string; border: string; bg: string; ring: string }
> = {
  ember: {
    stroke: "var(--ember)",
    fill: "var(--ember)",
    border: "border-[var(--ember)]",
    bg: "bg-[var(--ember)]/[0.08]",
    ring: "ring-[var(--ember)]/20",
  },
  red: {
    stroke: "#b91c1c",
    fill: "#b91c1c",
    border: "border-red-700",
    bg: "bg-red-50",
    ring: "ring-red-200",
  },
};

function LeftHalfIcon({
  active,
  size,
  stroke,
  fill,
}: {
  active: boolean;
  size: number;
  stroke: string;
  fill: string;
}) {
  const ring = active ? stroke : "var(--ink)";
  const wedge = active ? fill : "var(--ink)";
  const empty = active ? "white" : "var(--paper)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden
      className="shrink-0"
    >
      <circle
        cx="20"
        cy="20"
        r="14"
        fill={empty}
        stroke={ring}
        strokeWidth="2.5"
      />
      <path d="M20 6 A14 14 0 0 0 20 34 Z" fill={wedge} />
    </svg>
  );
}

function WholeIcon({
  active,
  size,
  stroke,
  fill,
}: {
  active: boolean;
  size: number;
  stroke: string;
  fill: string;
}) {
  const ring = active ? stroke : "var(--ink)";
  const inner = active ? fill : "var(--paper)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      aria-hidden
      className="shrink-0"
    >
      <circle
        cx="22"
        cy="22"
        r="15"
        fill="none"
        stroke={ring}
        strokeWidth="2.5"
      />
      <circle cx="22" cy="22" r="5.5" fill={inner} stroke={ring} strokeWidth="2" />
    </svg>
  );
}

function RightHalfIcon({
  active,
  size,
  stroke,
  fill,
}: {
  active: boolean;
  size: number;
  stroke: string;
  fill: string;
}) {
  const ring = active ? stroke : "var(--ink)";
  const wedge = active ? fill : "var(--ink)";
  const empty = active ? "white" : "var(--paper)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden
      className="shrink-0"
    >
      <circle
        cx="20"
        cy="20"
        r="14"
        fill={empty}
        stroke={ring}
        strokeWidth="2.5"
      />
      <path d="M20 6 A14 14 0 0 1 20 34 Z" fill={wedge} />
    </svg>
  );
}

const OPTIONS: {
  value: ToppingPlacement;
  label: string;
  render: (p: {
    active: boolean;
    size: number;
    stroke: string;
    fill: string;
  }) => ReactNode;
}[] = [
  {
    value: "left",
    label: "Left half only",
    render: (p) => <LeftHalfIcon {...p} />,
  },
  {
    value: "full",
    label: "Full pizza",
    render: (p) => <WholeIcon {...p} />,
  },
  {
    value: "right",
    label: "Right half only",
    render: (p) => <RightHalfIcon {...p} />,
  },
];

/**
 * Segmented control for topping coverage (full / left half / right half).
 */
export function PlacementToggle({
  value,
  onChange,
  idPrefix = "placement",
  compact = false,
  selectionAccent = "ember",
}: PlacementToggleProps) {
  const accent = ACCENT[selectionAccent];
  const iconSize = compact ? 30 : 40;
  const wholeSize = compact ? 32 : 44;
  const gap = compact ? "gap-1" : "gap-2 sm:gap-3";
  const pad = compact
    ? "px-1.5 py-1.5"
    : "px-3 py-2.5 sm:px-4 sm:py-3";
  const labelGap = compact ? "gap-0.5" : "gap-1.5";

  return (
    <div
      role="radiogroup"
      aria-label="Where on the pizza"
      className={`flex items-center justify-center ${gap}`}
    >
      {OPTIONS.map(({ value: v, label, render }) => {
        const selected = value !== null && value === v;
        const id = `${idPrefix}-${v}`;
        const size = v === "full" ? wholeSize : iconSize;
        const stroke = selected ? accent.stroke : "var(--ink)";
        const fill = selected ? accent.fill : "var(--ink)";
        return (
          <label
            key={v}
            className={`flex cursor-pointer flex-col items-center ${labelGap} rounded-xl border-2 ${pad} transition sm:rounded-2xl ${
              selected
                ? `${accent.border} ${accent.bg} shadow-sm shadow-black/10 ring-1 ${accent.ring}`
                : "border-stone-200/90 bg-white hover:border-stone-300"
            }`}
            onClick={(e) => {
              if (value !== null && value === v) {
                e.preventDefault();
                onChange(null, v);
              }
            }}
          >
            <input
              type="radio"
              name={idPrefix}
              id={id}
              value={v}
              checked={selected}
              onChange={() => {
                onChange(v);
              }}
              className="sr-only"
            />
            {render({
              active: selected,
              size,
              stroke,
              fill,
            })}
            {compact ? (
              <span className="sr-only">{label}</span>
            ) : (
              <>
                <span
                  className={`max-w-[5.5rem] text-center text-[10px] font-semibold uppercase leading-tight tracking-wide sm:text-[11px] ${
                    selected && selectionAccent === "red"
                      ? "text-red-800"
                      : "text-[var(--muted)]"
                  }`}
                >
                  {v === "full" ? "Whole" : v === "left" ? "Left" : "Right"}
                </span>
                <span className="sr-only">{label}</span>
              </>
            )}
          </label>
        );
      })}
    </div>
  );
}
