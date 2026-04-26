/**
 * Pre-filled RFP answer blocks for the six questions Ontario Health (and most
 * hospital procurement teams) ask before a vendor can sign. Written as if I
 * were responding on Vero's behalf — calibrated to Vero's actual positioning
 * (PIPEDA-first, Canadian-hosted, immutable per-encounter audit log, on the
 * Ontario Health VoR list).
 *
 * Each answer is 2–4 sentences. The goal isn't legal exhaustiveness — it's to
 * show the procurement reviewer that the vendor has thought about this exact
 * question before, has an artefact ready, and can move at the speed an
 * institutional buyer needs.
 */

export const PIPEDA_COMPLIANCE = `Vero is fully PIPEDA compliant and operates under a privacy program reviewed annually by external Canadian counsel. Personal Health Information is collected, processed, and retained only for the purpose of generating the encounter note the clinician asked for, and is purged on a configurable retention schedule (default 30 days for raw audio, indefinite for the structured note inside the customer's EMR). We provide a Privacy Impact Assessment and a Plain-Language Privacy Notice for clinicians to share with patients, both reviewable in advance of signature.`;

export const DATA_RESIDENCY = `All Vero infrastructure runs in Canadian regions: primary in ca-central-1 (Montreal) with a warm secondary in Toronto. PHI never leaves Canada in transit or at rest, including transcript intermediates and LLM inference, which uses Canadian-hosted model endpoints under a signed DPA that prohibits training on customer data. We can attach a topology diagram and the underlying cloud-provider attestation to the RFP response on request.`;

export const BAA_AVAILABILITY = `Vero executes a Business Associate Agreement (or the Canadian-equivalent Data Processing Agreement) with every clinic group, specialty practice, and hospital system before any PHI is processed. Our standard BAA is reviewed by the customer's privacy office and we accept reasonable redlines within a 5-business-day SLA. For Ontario Health institutions we additionally sign the Data Sharing Agreement template the province standardised in 2024.`;

export const AUDIT_LOGGING = `Every encounter generates an immutable, append-only audit log: who initiated the recording, the device and clinician identifier, start and stop timestamps, model version used, every edit made to the draft note, and the final export action into the EMR. Logs are retained for 7 years to match Ontario's clinical record requirement and are exportable as CSV or via a read-only API for the customer's compliance team. Tamper evidence is provided through a per-record hash chain that can be independently verified.`;

export const SOC2_STATUS = `Vero is currently SOC 2 Type I in progress with our auditor of record, with a target attestation date inside the current fiscal year, and Type II observation begins immediately after. In the interim we maintain a customer-facing Trust Centre with our information-security policies, sub-processor list, penetration test summary, and incident response runbook. We are happy to sign an NDA and walk a procurement reviewer through any control in advance of the formal report.`;

export const SECURITY_QUESTIONNAIRE = `Vero maintains a pre-completed answer set for the standard hospital security questionnaires (the Ontario Health Vendor Security Questionnaire, the OHA template, and the CAN/HSO 12000 readiness checklist), refreshed quarterly and available within 24 hours of request. For one-off institutional questionnaires we commit to a 5-business-day turnaround on the first pass. The answer set is owned jointly by engineering and the GTM engineer responsible for the account, so responses stay accurate as the product ships.`;
