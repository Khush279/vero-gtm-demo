/**
 * Shared data contracts for the Vero GTM demo. Every worker reads from this
 * file so the data shape is agreed once, not negotiated per surface.
 */

export type PipelineStage =
  | "new"
  | "researching"
  | "contacted"
  | "replied"
  | "demo_booked"
  | "trialing"
  | "customer"
  | "closed_lost";

export const PIPELINE_STAGES: { id: PipelineStage; label: string }[] = [
  { id: "new", label: "New" },
  { id: "researching", label: "Researching" },
  { id: "contacted", label: "Contacted" },
  { id: "replied", label: "Replied" },
  { id: "demo_booked", label: "Demo booked" },
  { id: "trialing", label: "Trialing" },
  { id: "customer", label: "Customer" },
  { id: "closed_lost", label: "Closed-lost" },
];

export type Segment = "clinic_solo" | "clinic_group" | "specialty" | "enterprise";

export const SEGMENT_LABELS: Record<Segment, string> = {
  clinic_solo: "Solo clinic",
  clinic_group: "Group practice",
  specialty: "Specialty group",
  enterprise: "Enterprise / system",
};

export type EmrInferred =
  | "telus_pss"
  | "telus_med_access"
  | "accuro"
  | "oscar"
  | "epic"
  | "cerner"
  | "input_health"
  | "unknown";

export const EMR_LABELS: Record<EmrInferred, string> = {
  telus_pss: "Telus PSS",
  telus_med_access: "Telus Med Access",
  accuro: "Accuro EMR",
  oscar: "OSCAR Pro",
  epic: "Epic",
  cerner: "Cerner",
  input_health: "InputHealth (WELL)",
  unknown: "Unknown",
};

export type Lead = {
  id: string;
  name: string;
  /** Free-form specialty string from CPSO (e.g. "Family Medicine"). */
  specialty: string;
  /** Year of CPSO registration. */
  yearRegistered: number;
  /** Languages spoken (English / French / etc.). */
  languages: string[];
  /** City, province (e.g. "Toronto, ON"). */
  city: string;
  /** Practice address line 1 (street + practice name). */
  practiceAddress: string;
  /** Inferred EMR from regional/clinic-name heuristics. */
  inferredEmr: EmrInferred;
  /** Segment bucket for pipeline filtering. */
  segment: Segment;
  /** ICP score 0–100. */
  score: number;
  /** Pipeline stage. */
  stage: PipelineStage;
  /** Days the lead has spent in its current stage (for staleness). */
  daysInStage: number;
  /** ISO timestamp of next scheduled touch (or null if none). */
  nextTouchAt: string | null;
  /** ISO timestamp of last contact (or null if never contacted). */
  lastContactedAt: string | null;
  /** Number of nearby competitors (Tali / Heidi) within ~5km, mocked. */
  nearbyCompetitorPresence: number;
  /** Source attribution. */
  source: "cpso_register";
};

export type EnterpriseAccount = {
  id: string;
  org: string;
  /** Approx. number of providers in the system. */
  providers: number;
  emr: EmrInferred;
  /** Mocked named champion (e.g. "Dr. Priya Shah, CMIO"). */
  champion: string;
  /** Procurement stage. */
  stage:
    | "discovery"
    | "qualified"
    | "rfp_issued"
    | "rfp_response"
    | "shortlisted"
    | "negotiation"
    | "closed_won"
    | "closed_lost";
  /** Next milestone label + due date. */
  nextMilestone: string;
  nextMilestoneDue: string; // ISO date
  /** Estimated ARR in CAD. */
  estimatedArr: number;
  /** Whether they're on the Ontario Health VoR list (matters for procurement). */
  vorEligible: boolean;
  notes: string;
};

export type Touch = {
  /** Day-N from sequence start (1, 4, 9, 16). */
  day: number;
  /** Channel for this touch. */
  channel: "email" | "linkedin" | "call";
  subject: string;
  body: string;
  /** What lever this touch leans on. */
  leverage:
    | "price_anchor"
    | "doc_upload_diff"
    | "pipeda_compliance"
    | "ontario_vor"
    | "peer_adoption"
    | "specialty_template"
    | "ehr_specific";
  /** Word count of the body for the operator's eye. */
  wordCount: number;
};

export type Sequence = {
  leadId: string;
  generatedAt: string;
  touches: Touch[];
};

export type Automation = {
  id: string;
  name: string;
  description: string;
  /** Cron expression or trigger description. */
  trigger: string;
  /** Last run timestamp + status (mocked or real). */
  lastRun: { at: string; status: "success" | "running" | "error"; note?: string };
  /** Path to the source file in this repo (relative). View-source expander reads it. */
  sourcePath: string;
  /** Hand-curated single-line summary of what the source does. */
  sourceSummary: string;
};
