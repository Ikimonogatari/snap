import Anthropic from "@anthropic-ai/sdk";
import type { Assessment, Industry } from "../../types";

const SYSTEM_PROMPT = `You are Snap, a consumer AI that turns a photo of a damaged or worn item into a fair, sharable assessment. Your users are Airbnb hosts, drivers, marketplace buyers/sellers, renters moving out, and people filing personal insurance claims — they need a fast, honest answer they can show another person.

Tone: clear, friendly, and grounded. No jargon. Reference visible evidence. Pick verdicts a normal person can act on.

Respond with a SINGLE JSON object only — no markdown fence, no commentary — matching this shape exactly:

{
  "detectedAsset": string,
  "confidence": number (0..1),
  "damages": [{ "type": string, "severity": "low"|"medium"|"high"|"critical", "location": string, "evidence": string }],
  "verdict": {
    "decision": "repair"|"replace"|"total_loss",
    "reason": string,
    "estimatedCost": { "amount": number, "currency": "USD"|"MNT" },
    "estimatedTimeMinutes": number
  },
  "repairSteps": [{ "index": number, "title": string, "description": string, "estMinutes": number, "toolsRequired": string[], "safetyNote": string|null }],
  "partsNeeded": string[],
  "safetyWarnings": string[],
  "reports": {
    "damageReport": string,    // formal 3-5 sentences for an insurer, host, or marketplace
    "claimSummary": string,    // 2-3 sentences a normal person can read
    "customerSummary": string  // 1 friendly sentence
  }
}

Use "repair" when the item is worth fixing (cost < ~60% of replacement). Use "replace" when fix cost approaches or exceeds replacement value. Use "total_loss" when the item is unsafe / unrecoverable or has near-zero residual value.

Always quote a fair cost. Be skeptical of inflated claims. For marketplace valuation, return the verdict as "repair" with the estimated cost set to the fair offer price the user should make.`;

interface AssessArgs {
  industry: Industry;
  asset: string;
  description: string;
  imageBase64?: string;
  imageMediaType?: "image/jpeg" | "image/png" | "image/webp";
}

export async function assessWithClaude(args: AssessArgs): Promise<Assessment> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return scriptedFallback(args.industry, args.asset, args.description);

  try {
    const client = new Anthropic({ apiKey: key });

    const userContent: Anthropic.MessageParam["content"] = [];
    if (args.imageBase64 && args.imageMediaType) {
      userContent.push({
        type: "image",
        source: { type: "base64", media_type: args.imageMediaType, data: args.imageBase64 },
      });
    }
    userContent.push({
      type: "text",
      text: `Use case category: ${args.industry}\nItem hint: ${args.asset}\nUser description: ${args.description}\n\nReturn JSON only.`,
    });

    const res = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 2400,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    const parsed = safeParseJson(text);
    if (!parsed) return scriptedFallback(args.industry, args.asset, args.description);

    return {
      ...parsed,
      generatedBy: "claude-opus-4-7" as const,
      generatedAt: new Date().toISOString(),
    } as Assessment;
  } catch (err) {
    console.error("[assess] claude error", err);
    return scriptedFallback(args.industry, args.asset, args.description);
  }
}

function safeParseJson(text: string): Partial<Assessment> | null {
  try {
    const trimmed = text.trim().replace(/^```json\s*/i, "").replace(/```$/, "");
    return JSON.parse(trimmed);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try { return JSON.parse(match[0]); } catch { return null; }
  }
}

function scriptedFallback(industry: Industry, asset: string, description: string): Assessment {
  const desc = description.toLowerCase();
  let key: keyof typeof templates = industry === "insurance" ? "car" :
                                    industry === "it" && desc.includes("iphone") ? "marketplace" :
                                    industry === "it" && desc.includes("coffee") ? "laptop_liquid" :
                                    industry === "it" ? "marketplace" :
                                    industry === "property" && desc.includes("deposit") ? "moveout" :
                                    industry === "property" ? "airbnb_lamp" :
                                    "airbnb_lamp";

  const base = templates[key];
  return {
    ...base,
    detectedAsset: base.detectedAsset || asset,
    generatedBy: "scripted-fallback",
    generatedAt: new Date().toISOString(),
  };
}

type Template = Omit<Assessment, "generatedBy" | "generatedAt">;

const templates: Record<string, Template> = {
  airbnb_lamp: {
    detectedAsset: "Designer floor lamp (mid-century style, fabric drum shade)",
    confidence: 0.91,
    damages: [
      { type: "Shade crack", severity: "medium", location: "Drum shade, mid-band", evidence: "Visible vertical fracture through the fabric and inner frame; lamp body and bulb appear intact." },
      { type: "Base / wiring", severity: "low", location: "Base + cord", evidence: "No visible damage; bulb still lights based on user note." },
    ],
    verdict: {
      decision: "replace",
      reason: "The shade is part of the lamp's value — and shades on this style are sold separately. Replacing just the shade is far cheaper than the full lamp.",
      estimatedCost: { amount: 65, currency: "USD" },
      estimatedTimeMinutes: 20,
    },
    repairSteps: [
      { index: 1, title: "Order a replacement drum shade", description: "Match the diameter (typically 14\" or 16\") and harp size. West Elm sells standalone shades from $55–$80.", estMinutes: 8, toolsRequired: [], safetyNote: null },
      { index: 2, title: "Swap the shade", description: "Unscrew the finial at the top, lift the damaged shade off, set the new one on the harp, re-screw the finial.", estMinutes: 5, toolsRequired: [], safetyNote: "Unplug the lamp before swapping the shade." },
      { index: 3, title: "Document the swap for your records", description: "Photograph the new shade installed. Keep your purchase receipt for the claim.", estMinutes: 7, toolsRequired: [], safetyNote: null },
    ],
    partsNeeded: ["Replacement drum shade · ~$65"],
    safetyWarnings: ["Unplug the lamp before any handling."],
    reports: {
      damageReport: "A mid-century-style designer floor lamp sustained a cracked fabric drum shade across the mid-band. The base, harp, wiring, and bulb assembly appear intact based on user statement (lamp lights). Recommended remediation is a shade-only replacement at approximately USD 65; full lamp replacement is not warranted.",
      claimSummary: "The lamp's shade is damaged but the lamp itself is fine. A fair claim is the cost of a replacement shade (about $65), not the full lamp. Receipts available on request.",
      customerSummary: "Shade-only replacement — about $65 is a fair claim.",
    },
  },
  car: {
    detectedAsset: "Hyundai Sonata 2021 — rear passenger-side door",
    confidence: 0.89,
    damages: [
      { type: "Dent + paint scuff", severity: "medium", location: "Rear passenger door, lower-center panel", evidence: "Shallow concave dent (~10cm) with white paint transfer; no visible damage to glass or sheet-metal seam." },
      { type: "Trim integrity", severity: "low", location: "Door handle + trim", evidence: "Handle and trim appear intact and aligned." },
    ],
    verdict: {
      decision: "repair",
      reason: "Paintless dent repair (PDR) plus a paint touch-up will restore the panel without a full panel respray. Total loss is not indicated; structural panel is unaffected.",
      estimatedCost: { amount: 280, currency: "USD" },
      estimatedTimeMinutes: 180,
    },
    repairSteps: [
      { index: 1, title: "Document for your insurance claim", description: "Take 5 photos: wide of the side, close-up of the dent, full vehicle front-quarter, license plate, odometer.", estMinutes: 8, toolsRequired: ["Phone camera"], safetyNote: null },
      { index: 2, title: "Get 2 PDR quotes", description: "Paintless dent repair shops can fix this in an afternoon. Ask for an itemized quote (dent + paint blend).", estMinutes: 30, toolsRequired: [], safetyNote: null },
      { index: 3, title: "Submit to insurer with quotes", description: "Attach the report below plus 2 quotes. Most insurers approve PDR claims same-day under $500.", estMinutes: 15, toolsRequired: [], safetyNote: null },
    ],
    partsNeeded: ["PDR labor + paint touch-up (no parts)"],
    safetyWarnings: ["Drive normally — no structural concern. Inspect door seals after repair."],
    reports: {
      damageReport: "Vehicle is a 2021 Hyundai Sonata with localized rear-door damage on the passenger side. The damage consists of a shallow concave dent approximately 10cm across with associated white paint transfer, consistent with a low-speed contact from a lighter-colored vehicle. Glass, seam, handle, and trim are intact. Recommended remediation is paintless dent repair plus paint touch-up, estimated at $280 / 3 hours.",
      claimSummary: "Low-speed parking-lot contact. Dent + paint scuff on rear door only — no structural damage. Repair estimate is $280 via PDR. Quotes attached.",
      customerSummary: "Fixable for about $280 — paintless dent repair plus paint touch-up.",
    },
  },
  marketplace: {
    detectedAsset: "iPhone 13 Pro 256GB",
    confidence: 0.94,
    damages: [
      { type: "Back glass crack", severity: "medium", location: "Lower-right corner of rear glass", evidence: "Hairline crack approximately 4cm with no spread. Crack does not interfere with camera lenses or MagSafe ring." },
      { type: "Corner ding", severity: "low", location: "Bottom-left chassis corner", evidence: "Small chip in the aluminum frame, cosmetic only." },
    ],
    verdict: {
      decision: "repair",
      reason: "This phone is worth buying — but well below the seller's ask. Used iPhone 13 Pro 256GB in this cosmetic condition trades for ₮1,250,000–₮1,400,000 in the UB market. Offer ₮1,300,000.",
      estimatedCost: { amount: 1300000, currency: "MNT" },
      estimatedTimeMinutes: 0,
    },
    repairSteps: [
      { index: 1, title: "Inspect in person", description: "Confirm the back-glass crack hasn't spread, test Face ID, all cameras, both speakers, both mics, charging port, MagSafe.", estMinutes: 15, toolsRequired: ["Charger", "Headphones (Bluetooth ok)"], safetyNote: null },
      { index: 2, title: "Verify activation lock is off", description: "Settings → General → Transfer or Reset → Erase All Content. Ensure Find My iPhone is OFF before payment.", estMinutes: 5, toolsRequired: [], safetyNote: "Never pay before the device is fully signed out of Apple ID." },
      { index: 3, title: "Counter-offer ₮1,300,000", description: "Reference comparable listings. Note the back-glass crack as the reason. Walk away if the seller refuses under ₮1,400,000.", estMinutes: 5, toolsRequired: [], safetyNote: null },
    ],
    partsNeeded: ["Optional: back-glass repair, ₮180,000 (cosmetic only — not required to use)"],
    safetyWarnings: ["Verify Find My is off and Apple ID is signed out before paying.", "Test both cameras, both speakers, and the charging port in person."],
    reports: {
      damageReport: "Device is an iPhone 13 Pro 256GB. Rear glass shows a hairline crack of approximately 4cm in the lower-right quadrant; no spread observed. A small chip in the aluminum frame at the bottom-left corner is cosmetic. Cameras, lenses, and MagSafe ring are not impacted by the crack. Fair market value in this cosmetic condition is ₮1,250,000–₮1,400,000.",
      claimSummary: "Used iPhone 13 Pro 256GB with hairline back-glass crack and a corner chip. Fair price: ₮1,300,000 — about ₮500,000 below the seller's asking price.",
      customerSummary: "Worth buying — but offer ₮1,300,000, not ₮1,800,000.",
    },
  },
  moveout: {
    detectedAsset: "Rental flat — bedroom wall + hardwood floor scuff",
    confidence: 0.82,
    damages: [
      { type: "Wall stain", severity: "low", location: "Bedroom wall, upper third", evidence: "Discoloration patch about 20cm wide. Consistent with normal wear or a poster-tape residue — not structural." },
      { type: "Floor scuff", severity: "low", location: "Hardwood floor, near doorway", evidence: "Surface scuff across two boards. No gouges, no splintering, no penetration to bare wood." },
    ],
    verdict: {
      decision: "repair",
      reason: "Both items fall under normal wear-and-tear. A landlord cannot legally deduct the full deposit for this. Fair touch-up cost (paint + floor polish) is what's owed at most.",
      estimatedCost: { amount: 45, currency: "USD" },
      estimatedTimeMinutes: 60,
    },
    repairSteps: [
      { index: 1, title: "Photograph everything before move-out", description: "Date-stamp photos of the entire flat, the stain, and the floor scuff. These become your evidence.", estMinutes: 15, toolsRequired: ["Phone camera"], safetyNote: null },
      { index: 2, title: "Offer to fix the touch-ups yourself", description: "A small can of matching wall paint (~$10) and a wood-floor polish kit (~$20) covers this. Total under $45 in materials.", estMinutes: 30, toolsRequired: ["Paint brush", "Floor polish kit"], safetyNote: null },
      { index: 3, title: "If the landlord still refuses, send the report below", description: "Mongolian tenancy law permits deduction only for damage beyond normal wear. The damage shown here is normal wear.", estMinutes: 15, toolsRequired: [], safetyNote: null },
    ],
    partsNeeded: ["Matching wall paint (~$10)", "Floor polish kit (~$20)"],
    safetyWarnings: [],
    reports: {
      damageReport: "Inspection of the rental flat shows two items raised by the landlord: a discoloration patch on the bedroom wall (~20cm) and a surface scuff on the hardwood floor near the doorway. Neither item shows damage beyond normal use; the wall is not gouged and the floor scuff is on the finish, not the wood substrate. Reasonable remediation is touch-up paint and floor polish at a combined cost of approximately $45 in materials.",
      claimSummary: "The two items the landlord flagged are normal wear-and-tear. Reasonable repair cost is about $45 in materials — not the full deposit.",
      customerSummary: "This is normal wear. $45 in materials is the most that's fair to deduct.",
    },
  },
  laptop_liquid: {
    detectedAsset: "MacBook Air M2 — keyboard liquid damage",
    confidence: 0.88,
    damages: [
      { type: "Liquid intrusion", severity: "high", location: "Keyboard tray + trackpad area", evidence: "User reports trackpad glitching after coffee spill. Liquid likely reached the trackpad ribbon cable and possibly the logic board." },
      { type: "Keyboard function", severity: "medium", location: "Keyboard layer", evidence: "Keys still register per user; sticky residue likely under keycaps, but corrosion risk is present." },
    ],
    verdict: {
      decision: "repair",
      reason: "Trackpad assembly replacement + keyboard cleaning is the right call here. A full logic-board repair is not warranted yet; cost is well below replacement.",
      estimatedCost: { amount: 320, currency: "USD" },
      estimatedTimeMinutes: 90,
    },
    repairSteps: [
      { index: 1, title: "Power down immediately. Do not turn back on.", description: "Even if it still works, every minute of power can corrode contacts. Shut down and disconnect.", estMinutes: 2, toolsRequired: [], safetyNote: "Do not attempt to dry with heat (hair dryer, oven). Heat damages the screen + battery." },
      { index: 2, title: "Take photos for your claim", description: "Photograph the spill area, the device, and any sticky residue. Note the time of the spill.", estMinutes: 5, toolsRequired: ["Phone camera"], safetyNote: null },
      { index: 3, title: "Bring to an authorized repair center", description: "iCare or Mac UB can clean the contacts, replace the trackpad assembly, and inspect the logic board.", estMinutes: 60, toolsRequired: [], safetyNote: null },
      { index: 4, title: "File your insurance claim with the report below", description: "Most home-content policies cover sudden accidental damage. Attach the report.", estMinutes: 23, toolsRequired: [], safetyNote: null },
    ],
    partsNeeded: ["Trackpad assembly (~$140)", "Keyboard cleaning + inspection labor (~$180)"],
    safetyWarnings: ["Do not power on the device until it's been inspected.", "Do not charge — heat from charging accelerates corrosion."],
    reports: {
      damageReport: "MacBook Air M2 sustained liquid intrusion after a coffee spill on the keyboard. User reports that keys still function but the trackpad is now glitching, consistent with liquid reaching the trackpad ribbon cable and/or its flex assembly. The keyboard layer likely retains sticky residue under keycaps. Recommended remediation is trackpad assembly replacement plus a keyboard contact cleaning at an authorized repair center; combined cost approximately $320 / 90 minutes.",
      claimSummary: "Coffee spill on a MacBook Air. Trackpad damaged, keyboard at risk. Estimated repair cost $320 — well below the device's value. Recommend filing under sudden accidental damage.",
      customerSummary: "Repairable for about $320 — please don't turn it back on until it's been inspected.",
    },
  },
};
