# Data Protection Impact Assessment

**Service:** Vero clinical AI scribe

**Customer:** [Customer Legal Name]

**Assessment Date:** [YYYY-MM-DD]

**Reviewed by:** [Customer Privacy Officer], [Vero Data Protection Officer]

This Data Protection Impact Assessment (DPIA) describes the processing of Personal Health Information (PHI) by the Vero clinical scribe service, the necessity and proportionality of that processing, the data flow, the risks to data subjects, and the mitigations in place. It is designed to satisfy PIPEDA accountability requirements and the equivalent provincial health-information legislation applicable to Customer (including PHIPA in Ontario).

## 1. Description of Processing

The Vero service processes the following categories of personal information:

- **Encounter audio.** Captured at the point of care from a clinician-controlled device. Recording requires explicit clinician initiation and patient verbal consent confirmed by the clinician.
- **Transcripts.** Generated from the audio by an automatic speech recognition model. Transcripts are intermediate artefacts used to produce the structured note.
- **Structured notes.** A draft clinical note in SOAP, APSO, or specialty-specific format, returned to the clinician for review.
- **Clinician metadata.** User identifier, device identifier, encounter start and stop timestamps, model version used, and edit history.
- **Patient identifier (optional).** A patient reference passed by the EMR for record linkage. Vero never receives or stores patient name, date of birth, address, or health card number unless the Customer chooses to enable name-display features and has executed the corresponding configuration.

Processing purpose: to generate a draft clinical note that the clinician reviews and signs into the EMR. No secondary use is permitted.

## 2. Necessity and Proportionality

Each data category is collected because it is required for the documentation purpose:

- Audio is necessary because the service produces a note from the spoken encounter.
- Transcripts are necessary as an intermediate step and are retained only as long as needed to debug or improve note quality, subject to the retention policy below.
- Structured notes are the deliverable. They are written into the customer's EMR and are governed by the customer's record-retention obligations.
- Metadata is the minimum needed for an immutable per-encounter audit log and for clinician identity verification.

No data category is collected beyond what is required for the stated purpose. The service does not process race, ethnicity, sexual orientation, or other special-category data fields except where the clinician dictates such information as part of the encounter, in which case the data is treated under the same controls as the rest of the encounter.

## 3. Data Flow

1. The clinician initiates a recording on a device they control. Audio is captured locally.
2. Audio is encrypted in transit (TLS 1.3) and sent to the Vero edge in Canada.
3. The edge forwards the encrypted stream to processing infrastructure in ca-central-1 (Montreal). A warm secondary is maintained in the Toronto region.
4. Transcription and note generation run on Canadian-hosted model endpoints under a signed sub-processor agreement that prohibits training on customer data.
5. The structured note is returned to the clinician's client. Audio and transcripts are stored encrypted at rest using AES-256 with keys managed in a Canadian KMS region.
6. The clinician edits and signs the note into the customer's EMR. The encounter is logged in the immutable audit log.

PHI does not leave Canada at any point in the pipeline. There is no cross-border transfer.

## 4. Risk Assessment

The following risks were identified and rated on likelihood and severity, each on a 1 to 5 scale:

| Risk | Likelihood | Severity | Score |
|---|---|---|---|
| Unauthorised access to stored audio or transcripts | 2 | 4 | 8 |
| Re-identification from a leaked structured note | 1 | 4 | 4 |
| Secondary use by Vero or sub-processor | 1 | 5 | 5 |
| Loss of availability during clinical hours | 2 | 3 | 6 |
| Insider misuse by Vero personnel | 1 | 5 | 5 |
| Mis-attribution of a note to the wrong patient | 1 | 4 | 4 |

The aggregate residual risk after mitigation is assessed as Low.

## 5. Risk Mitigation

- **Encryption.** AES-256 at rest, TLS 1.3 in transit. Keys managed in a Canadian KMS region with a documented rotation schedule.
- **Access controls.** Role-based access with multi-factor authentication for all Vero personnel. Production access is just-in-time, time-bounded, and logged.
- **Retention policy.** Raw audio is retained for a default of 30 days and is configurable per Customer. Transcripts follow the same schedule. Structured notes live in the Customer's EMR under the Customer's retention rules and are not held by Vero beyond the period required to confirm successful EMR ingestion.
- **Deletion on request.** Customer or, where applicable, the patient may request deletion. Vero confirms deletion within 14 days and provides a written attestation.
- **Sub-processor controls.** All sub-processors are listed in the Trust Centre, contractually prohibited from training on customer data, and reviewed annually.
- **Audit log.** Every encounter generates an immutable, append-only log entry. Logs are retained for 7 years to align with Ontario clinical record requirements and are exportable on demand.
- **Incident response.** Vero will notify Customer within 24 hours of confirmed incident detection and will support breach-notification obligations under applicable law.
- **Training and access reviews.** Vero personnel complete privacy and security training on hire and annually. Quarterly access reviews confirm least-privilege.

## 6. Sign-off

This DPIA has been reviewed and accepted by the parties below.

**Customer Privacy Officer**

Name: _____________________________

Signature: _____________________________

Date: _____________________________

**Vero Data Protection Officer**

Name: _____________________________

Signature: _____________________________

Date: _____________________________

---

*Template only. Not legal advice. Have your counsel and privacy office review before signing.*
