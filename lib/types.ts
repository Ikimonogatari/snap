export type Industry = "telecom" | "insurance" | "property" | "manufacturing" | "it";
export type Severity = "low" | "medium" | "high" | "critical";
export type CaseStatus = "queued" | "in_progress" | "assessing" | "resolving" | "done";
export type VerdictDecision = "repair" | "replace" | "total_loss";

export interface Damage {
  type: string;
  severity: Severity;
  location: string;
  evidence: string;
}

export interface Verdict {
  decision: VerdictDecision;
  reason: string;
  estimatedCost: { amount: number; currency: "USD" | "MNT" };
  estimatedTimeMinutes: number;
}

export interface RepairStep {
  index: number;
  title: string;
  description: string;
  estMinutes: number;
  toolsRequired: string[];
  safetyNote?: string | null;
}

export interface AssessmentReports {
  damageReport: string;
  claimSummary: string;
  customerSummary: string;
}

export interface PricingComponent {
  label: string;
  amount: number;
  currency: "USD" | "MNT";
  note?: string;
}

export interface FixLocation {
  name: string;
  address: string;
  phone?: string;
  distanceKm?: number;
  rating?: number;
  note?: string;
}

export interface MarketComparison {
  fairMarketValue?: number;
  replacementCost?: number;
  currency: "USD" | "MNT";
  source: string;
}

export interface Assessment {
  detectedAsset: string;
  confidence: number;
  damages: Damage[];
  verdict: Verdict;
  repairSteps: RepairStep[];
  partsNeeded: string[];
  safetyWarnings: string[];
  reports: AssessmentReports;
  pricingBreakdown?: PricingComponent[];
  fixLocations?: FixLocation[];
  marketComparison?: MarketComparison;
  generatedBy: "claude-opus-4-7" | "scripted-fallback";
  generatedAt: string;
}

export interface Case {
  id: string;
  caseCode: string;
  industry: Industry;
  assetType: string;
  asset: string;
  customer: string;
  location: string;
  coordinates: { lat: number; lng: number };
  reportedBy: string;
  reportedIssue: string;
  severity: Severity;
  status: CaseStatus;
  slaMinutes: number;
  assignedTo: string;
  createdAt: string;
  assessment?: Assessment;
  report?: ServiceReport;
}

export interface ServiceReport {
  resolvedIssue: string;
  partsUsed: string[];
  timeSpentMinutes: number;
  finalVerdict: "repaired" | "replaced" | "written_off";
  notes: string;
  closedAt: string;
}

export interface Technician {
  id: string;
  name: string;
  rating: number;
  specialty: string;
  industry: Industry;
  jobsToday: number;
  hoursSaved: number;
}

export interface FleetStats {
  activeTechnicians: number;
  openCases: number;
  avgAssessmentSeconds: number;
  costDecisionsThisWeek: number;
  costSavedUsd: number;
  firstTimeFixRate: number;
  resolutionDelta: number;
  byIndustry: { industry: Industry; count: number }[];
  technicians: Technician[];
}
