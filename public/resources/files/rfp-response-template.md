# Hospital RFP response template

Pre-filled answer blocks for the six questions Ontario Health (and most hospital procurement teams) ask before a vendor can sign. Copy into the institution's portal under their numbering. Each block is calibrated to Vero's actual positioning: PIPEDA-first, Canadian-hosted, immutable per-encounter audit log, on the Ontario Health VoR list.

The goal isn't legal exhaustiveness. It's to show the procurement reviewer that the vendor has thought about this exact question before, has an artefact ready, and can move at the speed an institutional buyer needs.

---

## How to use

1. **Triage the RFP first.** Score it against the 5-criterion rubric (champion identified, vendor count plausible, Ontario VoR applies, decision timeline, deal size). Pursue at 7+, judgment call at 5 or 6, no-pursue below.
2. **Run the discovery call.** Ask the 12 questions in the playbook. Question 12 ("what is the one thing we could do this week that would help you most?") is the most valuable.
3. **Paste the six blocks below into the security and privacy section.** Swap institution name, clinical sponsor, EMR if relevant.
4. **Defer the legal review.** Engineering owns first-pass technical accuracy. Privacy office owns final sign-off.

---

## Cover letter scaffold (1 page)

> Dear {{procurementContact}},
>
> Thank you for the opportunity to respond to {{institutionName}}'s RFP for an AI medical scribe solution, ref {{rfpId}}. Following our discovery call on {{discoveryDate}} with {{clinicalSponsor}} and {{privacyContact}}, we have built this response around the three priorities your team named: {{priority1}}, {{priority2}}, and {{priority3}}. Vero commits to a {{goLiveDate}} go-live and to the implementation plan attached as Appendix C, with named owners on both sides.
>
> {{founderName}}
> Vero Scribe Inc.

---

## Capability matrix (line-by-line)

Use the institution's exact numbering. Two columns: their requirement verbatim, our response. Use "Yes, see section 4.2" for capabilities, "Yes with caveat, see section 4.3" for partial coverage, and "No, see section 4.4 for compensating control" for gaps. Never bluff a capability. Procurement reviewers test for it.

---

## 1. PIPEDA compliance

Vero is fully PIPEDA compliant and operates under a privacy program reviewed annually by external Canadian counsel. Personal Health Information is collected, processed, and retained only for the purpose of generating the encounter note the clinician asked for, and is purged on a configurable retention schedule (default 30 days for raw audio, indefinite for the structured note inside the customer's EMR). We provide a Privacy Impact Assessment and a Plain-Language Privacy Notice for clinicians to share with patients, both reviewable in advance of signature.

**Artefacts attached.** Privacy Impact Assessment v2026.Q1, Plain-Language Privacy Notice (English + French), Patient Consent Script.

---

## 2. Data residency

All Vero infrastructure runs in Canadian regions: primary in ca-central-1 (Montreal) with a warm secondary in Toronto. PHI never leaves Canada in transit or at rest, including transcript intermediates and LLM inference, which uses Canadian-hosted model endpoints under a signed DPA that prohibits training on customer data. We can attach a topology diagram and the underlying cloud-provider attestation to the RFP response on request.

**Artefacts attached.** Network topology diagram, sub-processor list with Canadian-region attestations, DPA exemplar.

---

## 3. BAA / DPA availability

Vero executes a Business Associate Agreement (or the Canadian-equivalent Data Processing Agreement) with every clinic group, specialty practice, and hospital system before any PHI is processed. Our standard BAA is reviewed by the customer's privacy office and we accept reasonable redlines within a 5-business-day SLA. For Ontario Health institutions we additionally sign the Data Sharing Agreement template the province standardised in 2024.

**Artefacts attached.** Standard DPA template, Ontario Health DSA exemplar (signed and redacted).

---

## 4. Audit logging

Every encounter generates an immutable, append-only audit log: who initiated the recording, the device and clinician identifier, start and stop timestamps, model version used, every edit made to the draft note, and the final export action into the EMR. Logs are retained for 7 years to match Ontario's clinical record requirement and are exportable as CSV or via a read-only API for the customer's compliance team. Tamper evidence is provided through a per-record hash chain that can be independently verified.

**Artefacts attached.** Sample audit-log CSV export (3 redacted encounters), API reference for the read-only audit endpoint, hash-chain verification script.

---

## 5. SOC 2 status

Vero is currently SOC 2 Type I in progress with our auditor of record, with a target attestation date inside the current fiscal year, and Type II observation begins immediately after. In the interim we maintain a customer-facing Trust Centre with our information-security policies, sub-processor list, penetration test summary, and incident response runbook. We are happy to sign an NDA and walk a procurement reviewer through any control in advance of the formal report.

**Honest framing.** Be candid in writing about the Type II gap. Name the auditor. Give the target date. Offer the management assertion under NDA. Procurement reviewers respect candour and catch vendors who dance around it.

**Artefacts attached.** SOC 2 Type I status letter from the auditor, Trust Centre URL, sub-processor list, penetration test summary (full report under NDA).

---

## 6. Security questionnaire turnaround

Vero maintains a pre-completed answer set for the standard hospital security questionnaires (the Ontario Health Vendor Security Questionnaire, the OHA template, and the CAN/HSO 12000 readiness checklist), refreshed quarterly and available within 24 hours of request. For one-off institutional questionnaires we commit to a 5-business-day turnaround on the first pass. The answer set is owned jointly by engineering and the GTM engineer responsible for the account, so responses stay accurate as the product ships.

**Artefacts attached.** Pre-filled Ontario Health VSQ response, OHA template response, CAN/HSO 12000 readiness self-assessment.

---

## Pricing (held until last, never the lead)

Vero's standard pricing for {{institutionName}} is structured per active clinician per month, billed monthly with annual prepay discount available. For institutions on the Ontario Health VoR list we honour the negotiated VoR pricing; the published rate sheet is in Appendix D. Volume tiers begin at 25 active clinicians. Implementation is included; there are no per-seat setup fees, no separate license-server costs, and no add-ons for the standard EMR integrations (OSCAR, Telus PSS, Accuro, Practice Solutions).

---

## Implementation plan with named owners

| Phase | Vero owner | {{institution}} owner | Duration |
|---|---|---|---|
| Kickoff + scope confirmation | GTM engineer | Clinical sponsor | Week 0 |
| Privacy + security review | Compliance lead | Privacy office | Weeks 1 to 2 |
| EMR integration test environment | Solutions engineer | IT/EMR admin | Weeks 2 to 3 |
| Pilot cohort onboarding (5 clinicians) | Customer success | Clinical sponsor | Week 4 |
| Pilot review + go/no-go | Founder | CMIO | Week 6 |
| Full rollout | Customer success | Clinical sponsor | Weeks 7 onward |

---

## Appendices to include

- **Always:** VSQ response, PIA, architecture topology, SOC 2 Type I status letter, sample audit-log export, BAA/DPA template.
- **On request, NDA:** penetration test full report, sub-processor master list with contracts, internal incident response runbook.
- **Never:** full source code review, individual employee background-check records, internal red-team findings.

---

## Post-submit cadence

Most vendors lose the deal by going silent between submission and award. We do not.

- **Week 1.** One email to the clinical sponsor with a single piece of new value (a 4-minute recorded demo tailored to their EMR, or a written answer to a question they paused on during discovery).
- **Week 2.** One Slack-style note to procurement: "anything you need from us, low effort to ship".
- **Week 3.** Prep document 48 hours before any shortlist call. Otherwise one email asking for a decision-timeline update. Never "any update?".
- **Week 4 onward.** Monthly cadence with a single piece of useful content. Never empty check-ins.

The GTM engineer owns this cadence end to end. It does not get delegated to a generic SDR drip. The institution must feel like one person knows their file.
