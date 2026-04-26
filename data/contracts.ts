/**
 * /contracts page data. Three downloadable contract templates a Canadian
 * clinic procurement team would expect on day one: a Master Services
 * Agreement, a Data Protection Impact Assessment, and a mutual NDA. Each is
 * paired with a real markdown file shipped from /public/contracts/files so
 * the download button delivers the bytes.
 *
 * Why it exists: procurement reviewers ask "do you have templates?" before
 * they engage on price. Day-1 answer: yes, here they are.
 *
 * Templates only. Not legal advice. Customer counsel reviews before signing.
 */

export type ContractDoc = {
  id: string;
  title: string;
  description: string;
  fileType: "md";
  filename: string;
  downloadHref: string;
  bytesEstimate: number;
  whatItContains: string[];
  legalNotice: string;
  bestFor: string;
};

export const CONTRACTS: ContractDoc[] = [
  {
    id: "vero-msa-template",
    title: "Master Services Agreement",
    description:
      "Vendor MSA grounded in Vero's actual positioning: Canadian-hosted, PIPEDA-aligned, customer retains clinical data IP, Vero retains software IP. Ten sections a procurement team will recognise on first read.",
    fileType: "md",
    filename: "vero-msa-template.md",
    downloadHref: "/contracts/files/vero-msa-template.md",
    bytesEstimate: 6325,
    whatItContains: [
      "Services scope, term, termination, fees, and net 30 payment terms",
      "IP split: Vero retains software IP, Customer retains clinical data IP",
      "Data protection clause referencing the DPIA and Canadian residency",
      "Mutual indemnification and liability cap at trailing 12 months of fees",
      "Ontario governing law with exclusive Toronto jurisdiction",
    ],
    legalNotice: "Template only · not legal advice",
    bestFor: "Clinic group or hospital procurement starting a paper review",
  },
  {
    id: "vero-dpia-template",
    title: "Data Protection Impact Assessment",
    description:
      "PIPEDA-aligned DPIA covering audio capture, transcription, and note generation. Maps the data flow through ca-central-1, scores residual risk on a 5x5 matrix, and lists the controls that bring the score down.",
    fileType: "md",
    filename: "vero-dpia-template.md",
    downloadHref: "/contracts/files/vero-dpia-template.md",
    bytesEstimate: 6260,
    whatItContains: [
      "Processing description: audio, transcripts, structured notes, metadata",
      "Necessity and proportionality reasoning per data category",
      "Data flow diagram in prose: clinician to edge to ca-central-1, encrypted at rest",
      "Risk register with likelihood and severity scoring for six failure modes",
      "Mitigations: AES-256, retention defaults, deletion on request, immutable audit log",
    ],
    legalNotice: "Template only · not legal advice",
    bestFor: "Customer Privacy Officer reviewing a clinical AI vendor",
  },
  {
    id: "vero-mutual-nda",
    title: "Mutual Non-Disclosure Agreement",
    description:
      "Two-way NDA for the period before an MSA is signed. Standard exclusions, a three-year survival window, and injunctive relief baked in. Light enough to sign in a single review pass.",
    fileType: "md",
    filename: "vero-mutual-nda.md",
    downloadHref: "/contracts/files/vero-mutual-nda.md",
    bytesEstimate: 4177,
    whatItContains: [
      "Definition of Confidential Information with the four standard exclusions",
      "Permitted use, need-to-know recipients, and compelled-disclosure carve-out",
      "Two-year disclosure window with three-year confidentiality survival",
      "Return and destruction on request, with one archival copy permitted",
      "Injunctive relief and Ontario governing law",
    ],
    legalNotice: "Template only · not legal advice",
    bestFor: "Pre-MSA discovery: roadmap, pricing, security architecture",
  },
];
