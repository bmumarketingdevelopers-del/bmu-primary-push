/**
 * Statutory registrations shown on a public profile.
 *
 * Which ones apply depends on the trade, and getting that mapping right is
 * the difference between a useful feature and a form full of irrelevant
 * fields. A salon has no FSSAI obligation; a cloud kitchen has nothing else.
 */

export type LicenceKey =
  | "fssaiNumber" | "gstNumber" | "drugLicence" | "reraNumber"
  | "clinicRegNo" | "otherLicence";

export type LicenceDef = {
  key: LicenceKey;
  label: string;
  short: string;
  /** Why the business has to show it — this is the sales argument. */
  requirement: string;
  placeholder: string;
  /** Rough format check. Deliberately loose: a wrong-looking number that is
   *  actually correct must never be blocked. */
  pattern?: RegExp;
  /** Public register a customer can check it against. */
  verifyUrl?: string;
};

export const LICENCES: Record<LicenceKey, LicenceDef> = {
  fssaiNumber: {
    key: "fssaiNumber",
    label: "FSSAI licence number",
    short: "FSSAI",
    requirement:
      "Food businesses must display the FSSAI number where customers can see it. On a digital menu, that means on the menu.",
    placeholder: "12345678901234",
    pattern: /^\d{14}$/,
    verifyUrl: "https://foscos.fssai.gov.in/",
  },
  gstNumber: {
    key: "gstNumber",
    label: "GSTIN",
    short: "GST",
    requirement: "Registered businesses display their GSTIN at the place of business.",
    placeholder: "29AABCU9603R1ZX",
    pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]$/,
  },
  drugLicence: {
    key: "drugLicence",
    label: "Drug licence number",
    short: "Drug licence",
    requirement:
      "Pharmacies must display the licence and the registered pharmacist's details on the premises.",
    placeholder: "KA-B-20/12345",
  },
  reraNumber: {
    key: "reraNumber",
    label: "RERA registration",
    short: "RERA",
    requirement:
      "Every advertisement for a registered project must carry the RERA number — including a QR code that leads to project information.",
    placeholder: "PRM/KA/RERA/1251/446/PR/123456",
    verifyUrl: "https://rera.karnataka.gov.in/",
  },
  clinicRegNo: {
    key: "clinicRegNo",
    label: "Clinical establishment registration",
    short: "Clinic reg.",
    requirement:
      "Clinics and hospitals display their registration under the Clinical Establishments Act.",
    placeholder: "KA/CEA/2024/01234",
  },
  otherLicence: {
    key: "otherLicence",
    label: "Other licence",
    short: "Licence",
    requirement: "Anything sector-specific not covered above.",
    placeholder: "Trade licence, shop & establishment number…",
  },
};

/** Which licences a category is normally obliged to display. */
export const REQUIRED_BY_CATEGORY: Record<string, LicenceKey[]> = {
  RESTAURANT: ["fssaiNumber", "gstNumber"],
  CAFE: ["fssaiNumber", "gstNumber"],
  HOTEL: ["fssaiNumber", "gstNumber"],
  RETAIL: ["gstNumber"],
  HOSPITAL: ["clinicRegNo", "drugLicence", "gstNumber"],
  CLINIC: ["clinicRegNo", "gstNumber"],
  DOCTOR: ["clinicRegNo"],
  REAL_ESTATE: ["reraNumber", "gstNumber"],
  AUTOMOBILE: ["gstNumber"],
  GYM: ["gstNumber"],
  SALON: ["gstNumber"],
  SPA: ["gstNumber"],
  EDUCATION: [],
  AGENCY: ["gstNumber"],
  PROFESSIONAL: ["gstNumber"],
  FREELANCER: [],
  OTHER: ["gstNumber"],
};

export type ComplianceState = {
  key: LicenceKey;
  def: LicenceDef;
  value: string | null;
  required: boolean;
  present: boolean;
  looksValid: boolean;
};

/**
 * What's displayed, what's missing, and what's merely optional.
 *
 * Format mismatches are reported as a warning, never as an error. A number
 * that fails our regex but is genuinely correct must still show — being
 * wrong about the format is a smaller problem than hiding a real licence.
 */
export function complianceFor(
  category: string,
  values: Partial<Record<LicenceKey, string | null>>
): ComplianceState[] {
  const required = REQUIRED_BY_CATEGORY[category] ?? REQUIRED_BY_CATEGORY.OTHER;
  const keys = [...new Set([...required, ...(Object.keys(values) as LicenceKey[])])];

  return keys
    .filter((k) => LICENCES[k])
    .map((key) => {
      const value = values[key]?.trim() || null;
      const def = LICENCES[key];
      return {
        key,
        def,
        value,
        required: required.includes(key),
        present: Boolean(value),
        looksValid: !value || !def.pattern || def.pattern.test(value.toUpperCase()),
      };
    });
}

/** Missing statutory displays, worst first. */
export function complianceGaps(states: ComplianceState[]) {
  return states.filter((s) => s.required && !s.present);
}

export function complianceScore(states: ComplianceState[]) {
  const required = states.filter((s) => s.required);
  if (required.length === 0) return 100;
  return Math.round((required.filter((s) => s.present).length / required.length) * 100);
}
