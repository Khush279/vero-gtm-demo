/**
 * Pricing-calculator math, isolated as a pure module so the React widget and
 * the unit tests share one source of truth.
 *
 * The model is intentionally simple — sales conversations don't need a
 * stochastic ROI engine, they need a number a clinic owner can sanity-check
 * on the back of a napkin.
 *
 * Inputs come from sliders on /calculator. Outputs are everything the UI
 * needs to render, plus a four-vendor comparison strip.
 *
 * Pricing reference (per clinician, per month, retail) — strategy memo:
 *   Vero  $59.99
 *   Suki  $200
 *   DAX   $300
 *   Tali  $299
 */

export const VERO_PRICE_PER_CLINICIAN = 59.99;
export const SUKI_PRICE_PER_CLINICIAN = 200;
export const DAX_PRICE_PER_CLINICIAN = 300;
export const TALI_PRICE_PER_CLINICIAN = 299;

/** Average weeks per month, used to convert hours/week into hours/month. */
export const WEEKS_PER_MONTH = 4.33;

export type CalculatorInputs = {
  /** Number of clinicians at the practice. */
  clinicians: number;
  /** Hours per week per clinician spent charting after clinic. */
  chartingHoursPerWeek: number;
  /** Opportunity-cost rate per clinician hour, in USD. */
  hourlyRate: number;
  /** Current AI scribe cost per clinician per month, in USD. 0 = no scribe. */
  currentScribeCostPerClinician: number;
  /**
   * Expected fraction of charting time saved by a scribe, expressed as a
   * percentage (e.g. 50 means 50%). Sliders pass this in as 30..70.
   */
  timeSavingsPercent: number;
};

export type VendorComparison = {
  name: string;
  monthlyCost: number;
  annualCost: number;
  /** Multiplier vs Vero monthly (e.g. 5 means "5x more expensive than Vero"). */
  ratioVsVero: number;
  /** Annual dollars more than Vero (negative for Vero itself). */
  annualPremiumVsVero: number;
};

export type CalculatorOutputs = {
  /** Hours saved per clinician per week. */
  hoursSavedPerClinicianPerWeek: number;
  /** Hours saved across the whole practice per month. */
  hoursSavedPerPracticeMonth: number;
  /** Dollars of opportunity cost recaptured per month. */
  recapturedDollarsPerMonth: number;
  /** What Vero costs the practice per month. */
  veroMonthlyCost: number;
  /** What the current scribe (if any) costs the practice per month. */
  currentScribeMonthlyCost: number;
  /**
   * Net monthly savings of switching to Vero from the current state.
   * recaptured  -  vero  -  current scribe cost
   */
  netMonthlySavings: number;
  /** Net annual savings (12 x monthly). */
  netAnnualSavings: number;
  /**
   * Annual ROI multiplier — annual recaptured opportunity cost divided by
   * annual Vero cost. >1 means Vero pays for itself.
   */
  annualRoiMultiplier: number;
  /** Four-vendor comparison strip, Vero first. */
  vendorComparison: VendorComparison[];
};

/** Round to 2 decimals to avoid float noise in displayed dollar amounts. */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Compute every output the calculator UI renders from a single input bag.
 * Pure: same inputs always produce the same outputs.
 */
export function compute(inputs: CalculatorInputs): CalculatorOutputs {
  const clinicians = Math.max(0, inputs.clinicians);
  const chartingHours = Math.max(0, inputs.chartingHoursPerWeek);
  const hourlyRate = Math.max(0, inputs.hourlyRate);
  const currentScribe = Math.max(0, inputs.currentScribeCostPerClinician);
  const savingsFraction = Math.max(0, inputs.timeSavingsPercent) / 100;

  const hoursSavedPerClinicianPerWeek = chartingHours * savingsFraction;
  const hoursSavedPerPracticeMonth =
    hoursSavedPerClinicianPerWeek * clinicians * WEEKS_PER_MONTH;
  const recapturedDollarsPerMonth =
    hoursSavedPerPracticeMonth * hourlyRate;

  const veroMonthlyCost = clinicians * VERO_PRICE_PER_CLINICIAN;
  const currentScribeMonthlyCost = clinicians * currentScribe;

  const netMonthlySavings =
    recapturedDollarsPerMonth - veroMonthlyCost - currentScribeMonthlyCost;
  const netAnnualSavings = netMonthlySavings * 12;

  const annualVeroCost = veroMonthlyCost * 12;
  const annualRecaptured = recapturedDollarsPerMonth * 12;
  const annualRoiMultiplier =
    annualVeroCost > 0 ? annualRecaptured / annualVeroCost : 0;

  const vendorComparison = buildVendorComparison(clinicians);

  return {
    hoursSavedPerClinicianPerWeek: round2(hoursSavedPerClinicianPerWeek),
    hoursSavedPerPracticeMonth: round2(hoursSavedPerPracticeMonth),
    recapturedDollarsPerMonth: round2(recapturedDollarsPerMonth),
    veroMonthlyCost: round2(veroMonthlyCost),
    currentScribeMonthlyCost: round2(currentScribeMonthlyCost),
    netMonthlySavings: round2(netMonthlySavings),
    netAnnualSavings: round2(netAnnualSavings),
    annualRoiMultiplier: round2(annualRoiMultiplier),
    vendorComparison,
  };
}

/**
 * Four-vendor strip: Vero, Tali, DAX, Suki. Vero anchors the comparison;
 * the ratio for Vero itself is 1, the others scale up from there.
 */
export function buildVendorComparison(
  clinicians: number,
): VendorComparison[] {
  const safeClinicians = Math.max(0, clinicians);
  const veroMonthly = safeClinicians * VERO_PRICE_PER_CLINICIAN;
  const veroAnnual = veroMonthly * 12;

  const vendors: Array<{ name: string; perClinician: number }> = [
    { name: "Vero", perClinician: VERO_PRICE_PER_CLINICIAN },
    { name: "Tali", perClinician: TALI_PRICE_PER_CLINICIAN },
    { name: "DAX", perClinician: DAX_PRICE_PER_CLINICIAN },
    { name: "Suki", perClinician: SUKI_PRICE_PER_CLINICIAN },
  ];

  return vendors.map((v) => {
    const monthlyCost = safeClinicians * v.perClinician;
    const annualCost = monthlyCost * 12;
    const ratioVsVero =
      veroMonthly > 0
        ? monthlyCost / veroMonthly
        : v.perClinician / VERO_PRICE_PER_CLINICIAN;
    const annualPremiumVsVero = annualCost - veroAnnual;
    return {
      name: v.name,
      monthlyCost: round2(monthlyCost),
      annualCost: round2(annualCost),
      ratioVsVero: round2(ratioVsVero),
      annualPremiumVsVero: round2(annualPremiumVsVero),
    };
  });
}
