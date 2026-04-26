"use client";

import { useId, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import {
  compute,
  VERO_PRICE_PER_CLINICIAN,
  type CalculatorInputs,
  type CalculatorOutputs,
  type VendorComparison,
} from "@/lib/calculator";

/**
 * Interactive pricing / ROI calculator. Five sliders feed a pure compute()
 * function in lib/calculator.ts; the component just renders inputs, derived
 * outputs, and a four-vendor comparison strip.
 *
 * Layout is editorial — section labels in mono small-caps, sliders left,
 * derived numbers right, comparison strip beneath. The widget is intended to
 * be embedded on /calculator and reused as a sales artifact in conversations
 * with clinic owners.
 */

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usdCentsFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

const integerFormatter = new Intl.NumberFormat("en-US");

function formatUsd(n: number): string {
  return usdFormatter.format(n);
}

function formatUsdPrecise(n: number): string {
  return usdCentsFormatter.format(n);
}

function formatHours(n: number): string {
  return numberFormatter.format(n);
}

function formatInt(n: number): string {
  return integerFormatter.format(n);
}

const DEFAULT_INPUTS: CalculatorInputs = {
  clinicians: 5,
  chartingHoursPerWeek: 7,
  hourlyRate: 200,
  currentScribeCostPerClinician: 0,
  timeSavingsPercent: 50,
};

export function PricingCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);

  const outputs = useMemo<CalculatorOutputs>(() => compute(inputs), [inputs]);

  function update<K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K],
  ) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <section className="space-y-10">
      {/* Inputs */}
      <div className="rounded-lg border border-border/70 bg-card">
        <SectionLabel>01 · Practice inputs</SectionLabel>
        <div className="grid grid-cols-1 gap-x-10 gap-y-7 px-5 py-6 md:grid-cols-2 md:px-7 md:py-7">
          <SliderRow
            label="Clinicians on staff"
            unit="clinicians"
            value={inputs.clinicians}
            min={1}
            max={50}
            step={1}
            displayValue={formatInt(inputs.clinicians)}
            onChange={(v) => update("clinicians", v)}
            help="How many physicians, NPs, or PAs would use Vero."
          />
          <SliderRow
            label="After-clinic charting"
            unit="hours / week"
            value={inputs.chartingHoursPerWeek}
            min={0}
            max={15}
            step={0.5}
            displayValue={formatHours(inputs.chartingHoursPerWeek)}
            onChange={(v) => update("chartingHoursPerWeek", v)}
            help="Hours each clinician spends on notes after their last patient."
          />
          <SliderRow
            label="Opportunity cost per clinician"
            unit="$ / hour"
            value={inputs.hourlyRate}
            min={80}
            max={400}
            step={10}
            displayValue={formatUsd(inputs.hourlyRate)}
            onChange={(v) => update("hourlyRate", v)}
            help="What an hour of clinician time is worth (billing, locum, or wellness)."
          />
          <SliderRow
            label="Current scribe spend"
            unit="$ / clinician / mo"
            value={inputs.currentScribeCostPerClinician}
            min={0}
            max={400}
            step={5}
            displayValue={formatUsd(inputs.currentScribeCostPerClinician)}
            onChange={(v) => update("currentScribeCostPerClinician", v)}
            help="Set to 0 if the practice has no AI scribe yet."
          />
          <SliderRow
            label="Time savings expected"
            unit="% of charting"
            value={inputs.timeSavingsPercent}
            min={30}
            max={70}
            step={1}
            displayValue={`${inputs.timeSavingsPercent}%`}
            onChange={(v) => update("timeSavingsPercent", v)}
            help="Mid-band 50% matches Vero's reported clinical pilot data."
            className="md:col-span-2"
          />
        </div>
      </div>

      {/* Outputs */}
      <div className="space-y-5">
        <SectionLabel as="h2">02 · What it means</SectionLabel>
        <HeadlineNumber outputs={outputs} clinicians={inputs.clinicians} />
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border/60 bg-border/60 lg:grid-cols-3">
          <OutputCell
            label="Hours saved / clinician / week"
            value={`${formatHours(outputs.hoursSavedPerClinicianPerWeek)} hr`}
            sub="charting × time-savings %"
          />
          <OutputCell
            label="Hours saved / practice / month"
            value={`${formatHours(outputs.hoursSavedPerPracticeMonth)} hr`}
            sub="hr/wk × clinicians × 4.33"
          />
          <OutputCell
            label="Opportunity $ recaptured / mo"
            value={formatUsd(outputs.recapturedDollarsPerMonth)}
            sub="hours saved × hourly rate"
          />
          <OutputCell
            label="Vero cost / month"
            value={formatUsd(outputs.veroMonthlyCost)}
            sub={`${formatUsdPrecise(VERO_PRICE_PER_CLINICIAN)} / clinician`}
          />
          <OutputCell
            label="Net monthly savings vs today"
            value={formatUsd(outputs.netMonthlySavings)}
            sub="recaptured − Vero − current scribe"
            tone={outputs.netMonthlySavings >= 0 ? "positive" : "negative"}
          />
          <OutputCell
            label="Annual ROI multiplier"
            value={`${formatHours(outputs.annualRoiMultiplier)}×`}
            sub="recaptured / Vero, annualized"
            tone={outputs.annualRoiMultiplier >= 1 ? "positive" : "negative"}
          />
        </div>
      </div>

      {/* Vendor comparison */}
      <div className="space-y-5">
        <SectionLabel as="h2">03 · Vero vs the four you&rsquo;re comparing</SectionLabel>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {outputs.vendorComparison.map((v) => (
            <VendorCard key={v.name} vendor={v} />
          ))}
        </div>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground">
          Per-clinician retail: Vero {formatUsdPrecise(VERO_PRICE_PER_CLINICIAN)} ·
          Suki $200 · Tali $299 · DAX $300
        </p>
      </div>
    </section>
  );
}

function SectionLabel({
  children,
  as: As = "div",
}: {
  children: React.ReactNode;
  as?: "div" | "h2";
}) {
  return (
    <As className="border-b border-border/60 px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground md:px-7">
      {children}
    </As>
  );
}

function SliderRow({
  label,
  unit,
  value,
  min,
  max,
  step,
  displayValue,
  onChange,
  help,
  className,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (n: number) => void;
  help?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className="text-[13px] font-medium tracking-tight text-foreground"
        >
          {label}
        </label>
        <span className="font-mono text-[12px] tabular-nums text-foreground">
          {displayValue}
          <span className="ml-1 text-muted-foreground/80">{unit}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "h-2 w-full appearance-none rounded-full bg-muted accent-primary",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4",
          "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary",
          "[&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-primary",
          "[&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer",
          "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4",
          "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary",
          "[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer",
        )}
      />
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
        <span>{formatRangeBound(min, unit)}</span>
        <span>{formatRangeBound(max, unit)}</span>
      </div>
      {help ? (
        <p className="text-[12px] leading-relaxed text-muted-foreground">{help}</p>
      ) : null}
    </div>
  );
}

function formatRangeBound(n: number, unit: string): string {
  if (unit.includes("$")) return formatUsd(n);
  if (unit.includes("%")) return `${n}%`;
  return formatHours(n);
}

function HeadlineNumber({
  outputs,
  clinicians,
}: {
  outputs: CalculatorOutputs;
  clinicians: number;
}) {
  const annual = outputs.netAnnualSavings;
  const positive = annual >= 0;
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-4 rounded-md border bg-card p-5 md:p-6",
        positive ? "border-forest-300/70" : "border-destructive/30",
      )}
    >
      <div className="space-y-1">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          Headline
        </div>
        <div
          className={cn(
            "font-display text-[32px] font-light leading-[1.05] tracking-tightest md:text-[40px]",
            positive ? "text-forest-800" : "text-destructive",
          )}
        >
          Vero {positive ? "saves" : "costs"} this practice{" "}
          <span className="tabular-nums">{formatUsd(Math.abs(annual))}</span>/yr.
        </div>
        <p className="text-[13.5px] leading-relaxed text-muted-foreground">
          Across {formatInt(clinicians)} clinician{clinicians === 1 ? "" : "s"} at{" "}
          {formatUsdPrecise(VERO_PRICE_PER_CLINICIAN)}/clinician/mo, against the
          time and dollars they get back.
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
          ROI multiplier
        </div>
        <div className="font-display text-[28px] font-light leading-none tracking-tight tabular-nums text-foreground">
          {formatHours(outputs.annualRoiMultiplier)}×
        </div>
      </div>
    </div>
  );
}

function OutputCell({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "positive" | "negative";
}) {
  const valueTone =
    tone === "positive"
      ? "text-forest-800"
      : tone === "negative"
        ? "text-destructive"
        : "text-foreground";
  return (
    <div className="flex flex-col justify-between gap-2 bg-card p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
      <div
        className={cn(
          "font-display text-[24px] font-light leading-none tracking-tight tabular-nums",
          valueTone,
        )}
      >
        {value}
      </div>
      {sub ? (
        <div className="font-mono text-[10px] tracking-[0.04em] text-muted-foreground/80">
          {sub}
        </div>
      ) : null}
    </div>
  );
}

function VendorCard({ vendor }: { vendor: VendorComparison }) {
  const isVero = vendor.name === "Vero";
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-md border p-4",
        isVero
          ? "border-forest-400/70 bg-forest-50/60"
          : "border-border/70 bg-card",
      )}
    >
      <div className="flex items-baseline justify-between">
        <div
          className={cn(
            "font-display text-[18px] tracking-tight",
            isVero ? "text-forest-900" : "text-foreground",
          )}
        >
          {vendor.name}
        </div>
        <div
          className={cn(
            "font-mono text-[10px] uppercase tracking-[0.2em]",
            isVero ? "text-forest-700" : "text-muted-foreground",
          )}
        >
          {vendor.ratioVsVero === 1
            ? "baseline"
            : `${formatHours(vendor.ratioVsVero)}× vs Vero`}
        </div>
      </div>
      <div className="space-y-0.5">
        <div className="font-display text-[22px] font-light leading-none tracking-tight tabular-nums text-foreground">
          {formatUsd(vendor.monthlyCost)}
          <span className="ml-1 font-mono text-[11px] text-muted-foreground">
            / mo
          </span>
        </div>
        <div className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {formatUsd(vendor.annualCost)} / yr
        </div>
      </div>
      <div
        className={cn(
          "font-mono text-[11px] tabular-nums",
          isVero ? "text-forest-700" : "text-muted-foreground",
        )}
      >
        {isVero
          ? "anchor for the comparison"
          : `${formatUsd(vendor.annualPremiumVsVero)} more / yr than Vero`}
      </div>
    </div>
  );
}

export default PricingCalculator;
