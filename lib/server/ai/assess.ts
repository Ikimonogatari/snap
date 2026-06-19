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
  const assetLow = asset.toLowerCase();
  const isCrash = industry === "insurance" || assetLow.includes("toyota") || assetLow.includes("hyundai") || assetLow.includes("prius") || assetLow.includes("sonata") || assetLow.includes("land cruiser");
  const isBigCrash = isCrash && (desc.includes("цагдаа") || desc.includes("police") || desc.includes("даатгал") || desc.includes("монгол даатгал") || desc.includes("бампер хагар") || desc.includes("хагар"));

  const key: keyof typeof templates =
    isCrash && isBigCrash ? "car_big" :
    isCrash ? "car_small" :
    industry === "it" && desc.includes("iphone") ? "marketplace" :
    industry === "it" && (desc.includes("coffee") || desc.includes("кофе") || desc.includes("macbook")) ? "laptop_liquid" :
    industry === "it" ? "marketplace" :
    industry === "property" && (desc.includes("deposit") || desc.includes("барьцаа")) ? "moveout" :
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
    pricingBreakdown: [
      { label: "Replacement drum shade", amount: 60, currency: "USD", note: "West Elm or matching brand" },
      { label: "Shipping to UB", amount: 5, currency: "USD", note: "via DHL or local courier" },
      { label: "Labour (swap)", amount: 0, currency: "USD", note: "DIY, no tools required" },
    ],
    marketComparison: {
      replacementCost: 400,
      currency: "USD",
      source: "Full lamp ~$400 retail. Shade-only repair = 16% of replacement.",
    },
    fixLocations: [
      { name: "West Elm Online · ships to MN", address: "westelm.com · cart, ship via DHL", phone: undefined, rating: 4.7, note: "Standalone shade SKU available" },
      { name: "Onon Decor", address: "Sukhbaatar, Olympic St 12 (interior store)", phone: "+976 7011-8899", distanceKm: 1.6, rating: 4.5, note: "Stocks similar drum shades" },
      { name: "IKEA UB (proxy buy)", address: "Khan-Uul, central retail", phone: undefined, distanceKm: 4.4, rating: 4.4, note: "Compatible IKEA shade for ~$30" },
    ],
  },
  car_small: {
    detectedAsset: "Toyota Prius 30 — rear-right door",
    confidence: 0.92,
    damages: [
      { type: "Small dent + paint scuff", severity: "low", location: "Lower rear-right door, mid panel", evidence: "Shallow concave dent ~5–7cm wide. Paint scuffed at the surface; no metal exposed. Window, frame, handle, seal all intact." },
      { type: "Door operation", severity: "low", location: "Handle + frame", evidence: "Door opens and closes normally. No unusual noise." },
    ],
    verdict: {
      decision: "repair",
      reason: "Minor damage — settling on the spot is the right call. A dent of this size repairs for ₮80,000–₮120,000 with paintless dent repair (PDR) plus a paint blend. No need to call the police.",
      estimatedCost: { amount: 95000, currency: "MNT" },
      estimatedTimeMinutes: 120,
    },
    repairSteps: [
      { index: 1, title: "Show this assessment to the other driver", description: "Show them the Snap report on your phone. ₮95,000 is the fair number. Aim to settle here at this number.", estMinutes: 3, toolsRequired: [], safetyNote: null },
      { index: 2, title: "Write a short handwritten note and get signatures", description: "Date, time, both plate numbers, brief damage description, agreed amount. Both drivers sign + one witness signs.", estMinutes: 8, toolsRequired: ["Phone camera"], safetyNote: "If the other driver refuses to sign — stop here. Call the police and Mongol Daatgal." },
      { index: 3, title: "Pay or receive cash, or use a bank transfer", description: "QPay or bank transfer leaves a paper trail. Keep the Snap report and the payment receipt together.", estMinutes: 5, toolsRequired: [], safetyNote: null },
    ],
    partsNeeded: ["PDR repair + paint blend (no replacement parts)"],
    safetyWarnings: ["Safe to drive normally. Check the door seal after repair, in case water can get in.", "Never accept a verbal-only agreement. Always get signatures + 1 witness."],
    reports: {
      damageReport: "Toyota Prius 30 with minor damage. A 5–7cm shallow dent in the lower rear-right door, paint scuffed at the surface only. Window, frame, handle, and seal are all intact. Recommendation: PDR + paint blend, total ~₮95,000 / 2 hours. No structural damage — safe to settle in writing on the spot.",
      claimSummary: "Small parking-lot dent + paint scuff. Repairable with PDR + paint blend. Fair value ₮95,000. Can be settled on the spot without calling the police.",
      customerSummary: "Safe to settle on the spot — ₮95,000 is the fair number.",
    },
    pricingBreakdown: [
      { label: "Paintless dent repair (PDR)", amount: 55000, currency: "MNT", note: "1 area × medium severity" },
      { label: "Paint blend + polish", amount: 30000, currency: "MNT", note: "color match the door" },
      { label: "Replacement parts", amount: 0, currency: "MNT", note: "none required" },
      { label: "Labour (2 hours)", amount: 10000, currency: "MNT", note: "UB average shop rate" },
    ],
    marketComparison: {
      replacementCost: 1800000,
      currency: "MNT",
      source: "Full door replacement ≈ ₮1,800,000 (Toyota Mongolia parts). This repair is ~5% of replacement.",
    },
    fixLocations: [
      { name: "Sengur Auto Service", address: "Khan-Uul, 11th khoroo, auto service complex", phone: "+976 9911-2234", distanceKm: 2.4, rating: 4.7, note: "PDR specialist" },
      { name: "Erkhet Garage", address: "Songinokhairkhan, 21st khoroo", phone: "+976 8800-7711", distanceKm: 4.8, rating: 4.5, note: "Accepts Snap reports digitally" },
      { name: "Tegun Auto Service", address: "Bayanzurkh, Peace Ave 14A", phone: "+976 9911-5566", distanceKm: 3.1, rating: 4.6 },
    ],
  },
  car_big: {
    detectedAsset: "Hyundai Sonata 2021 — front-right door + bumper",
    confidence: 0.88,
    damages: [
      { type: "Bumper crack", severity: "high", location: "Front bumper, 28cm crack across the center", evidence: "ABS material cracked all the way through, with one side of the parking sensor dislodged. Paint transfer visible across the lower section." },
      { type: "Door deformation", severity: "high", location: "Front-right door, lower half", evidence: "Door pushed inward 3–4cm and lost its shape. The door only half-opens." },
      { type: "Parking sensor", severity: "medium", location: "Inside the bumper", evidence: "Sensor position is displaced and requires recalibration." },
    ],
    verdict: {
      decision: "repair",
      reason: "No structural steel or frame damage visible. Replacing the bumper + door and recalibrating the sensor is about 25% of the vehicle's value — not a total loss. Eligible under Mongol Daatgal's compulsory motor liability insurance (ХАОДД).",
      estimatedCost: { amount: 2400000, currency: "MNT" },
      estimatedTimeMinutes: 360,
    },
    repairSteps: [
      { index: 1, title: "If the police have been called — stay in place", description: "Don't move either vehicle until the police arrive. Push broken glass + debris aside. Place a hazard triangle 30m back.", estMinutes: 10, toolsRequired: ["Hazard triangle"], safetyNote: "If you're blocking traffic, get permission from the insurer before moving the car to the side." },
      { index: 2, title: "Call Mongol Daatgal (REQUIRED BEFORE THE POLICE DECIDE)", description: "1800-1100 (24h hotline). A field adjuster comes to the scene and runs the damage assessment. Under ХАОДД, the insurer's act is required before the officer can assign fault.", estMinutes: 30, toolsRequired: ["Phone"], safetyNote: "Keep your insurance certificate ready so you can give your policy number." },
      { index: 3, title: "Hand the Snap report to the adjuster", description: "The detected damages + photos from Snap go directly into the adjuster's act, saving them 20–30 minutes of paperwork.", estMinutes: 5, toolsRequired: [], safetyNote: null },
      { index: 4, title: "Police decide fault — Snap becomes evidence", description: "The detected damages + impact pattern from Snap is visual evidence for the violation protocol. Attach it to the report.", estMinutes: 20, toolsRequired: [], safetyNote: null },
      { index: 5, title: "Claim is paid by the at-fault driver's insurance", description: "Under ХАОДД, the at-fault driver's insurance covers the repair. The insurer also covers the tow to the shop (within 50km).", estMinutes: 0, toolsRequired: [], safetyNote: null },
    ],
    partsNeeded: ["1× OEM bumper (Hyundai Sonata 2021)", "1× front-right door", "1× parking sensor housing", "Paint + primer + clear coat materials"],
    safetyWarnings: ["Don't try to drive the car yourself — a sensor cable inside the bumper may be cut.", "Stay in your original position until the police arrive. Photograph everything while you wait.", "If the police assign fault before the Mongol Daatgal adjuster arrives, the insurer can dispute the claim."],
    reports: {
      damageReport: "Hyundai Sonata 2021 with serious damage. A 28cm crack across the middle of the front bumper, the front-right door pushed in 3–4cm and only half-opens. One side of the parking sensor mount is broken loose. Structural steel is intact. Recommendation: replace bumper + door, recalibrate the parking sensor, total ~₮2,400,000 / 6 hours. Not a total loss — fully covered under Mongol Daatgal ХАОДД.",
      claimSummary: "Side-impact collision at an intersection. Bumper + front-right door need replacement. No structural damage. Total repair ~₮2,400,000. The Snap report serves as evidence both for the Mongol Daatgal act and for the traffic police violation protocol.",
      customerSummary: "Repairable — fully covered under Mongol Daatgal ХАОДД at ~₮2,400,000.",
    },
    pricingBreakdown: [
      { label: "OEM bumper (Hyundai Sonata 2021)", amount: 920000, currency: "MNT", note: "Hyundai Mongolia parts" },
      { label: "Front-right door panel", amount: 780000, currency: "MNT", note: "OEM, color-matched" },
      { label: "Parking sensor housing + recalibration", amount: 180000, currency: "MNT", note: "OBD-tool recalibration required" },
      { label: "Paint + clear coat + materials", amount: 240000, currency: "MNT" },
      { label: "Labour (6 hours @ ₮48,000/hr)", amount: 280000, currency: "MNT", note: "UB body shop rate" },
    ],
    marketComparison: {
      replacementCost: 38000000,
      currency: "MNT",
      source: "Used 2021 Sonata market value ≈ ₮38M (Unegui.mn comps). Repair = 6.3% of replacement → not a total loss.",
    },
    fixLocations: [
      { name: "Hyundai Service Center", address: "Khan-Uul, Chinggis Ave 7, official dealer", phone: "+976 7700-1818", distanceKm: 5.2, rating: 4.8, note: "OEM warranty work · accepts Mongol Daatgal direct billing" },
      { name: "Sengur Auto Service", address: "Khan-Uul, 11th khoroo, auto service complex", phone: "+976 9911-2234", distanceKm: 2.4, rating: 4.7, note: "Body + paint specialist" },
      { name: "Pro Body Shop", address: "Bayangol, 17th khoroo", phone: "+976 8800-3399", distanceKm: 6.0, rating: 4.5, note: "Insurer-preferred shop" },
    ],
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
    pricingBreakdown: [
      { label: "Base fair value (cosmetic condition)", amount: 1400000, currency: "MNT", note: "iPhone 13 Pro 256GB used market" },
      { label: "Back-glass crack discount", amount: -80000, currency: "MNT", note: "cosmetic; doesn't affect use" },
      { label: "Corner ding discount", amount: -20000, currency: "MNT", note: "cosmetic" },
    ],
    marketComparison: {
      fairMarketValue: 1300000,
      replacementCost: 1800000,
      currency: "MNT",
      source: "Comparable Unegui.mn + Facebook Marketplace listings UB · last 30 days, condition matched.",
    },
    fixLocations: [
      { name: "iCare (back-glass repair, optional)", address: "Bayangol, Peace Ave 12B", phone: "+976 7011-5566", distanceKm: 3.2, rating: 4.7, note: "₮180,000 if you want the crack fixed after buying" },
      { name: "iService Mongolia", address: "Sukhbaatar, Trade Centre tower 1F", phone: "+976 7611-2200", distanceKm: 1.5, rating: 4.6, note: "Apple-authorized" },
      { name: "Mac UB · Apple Premium Reseller", address: "Sukhbaatar district, TDB tower 1F", phone: "+976 7611-2233", distanceKm: 1.8, rating: 4.8 },
    ],
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
    pricingBreakdown: [
      { label: "Matching wall paint (small can)", amount: 10, currency: "USD" },
      { label: "Wood-floor polish kit", amount: 20, currency: "USD" },
      { label: "Applicator + brush + cloth", amount: 8, currency: "USD" },
      { label: "Labour (DIY, 1 hour)", amount: 7, currency: "USD", note: "or hire a handyperson" },
    ],
    marketComparison: {
      replacementCost: 600,
      currency: "USD",
      source: "A typical 2BR deposit in UB is ~$600. Reasonable deduction = 7.5% of deposit.",
    },
    fixLocations: [
      { name: "Build & Decor UB", address: "Bayangol, Tovchoo construction market", phone: "+976 7011-0011", distanceKm: 3.5, rating: 4.4, note: "Paint + floor finishes" },
      { name: "WeFix.mn (handyperson)", address: "online dispatch · UB-wide", phone: "+976 7700-2200", rating: 4.6, note: "Send the Snap report, get a fixed quote" },
      { name: "Nomin Hardware", address: "Multiple branches · UB", phone: undefined, rating: 4.3, note: "Walk-in for paint matching" },
    ],
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
    pricingBreakdown: [
      { label: "Trackpad assembly (OEM)", amount: 140, currency: "USD", note: "MBA-M2 trackpad SKU" },
      { label: "Keyboard contact cleaning", amount: 60, currency: "USD", note: "ultrasonic + isopropyl" },
      { label: "Logic-board inspection", amount: 40, currency: "USD", note: "rule out corrosion" },
      { label: "Labour (90 minutes, certified)", amount: 80, currency: "USD" },
    ],
    marketComparison: {
      replacementCost: 1200,
      currency: "USD",
      source: "New MBA M2 ≈ $1,200. Repair = 27% of replacement → clear repair.",
    },
    fixLocations: [
      { name: "iCare Service Center", address: "Bayangol, Peace Ave 12B", phone: "+976 7011-5566", distanceKm: 3.2, rating: 4.7, note: "Liquid-damage specialist" },
      { name: "Mac UB · Apple Premium Reseller", address: "Sukhbaatar district, TDB tower 1F", phone: "+976 7611-2233", distanceKm: 1.8, rating: 4.8, note: "Genuine parts, AppleCare-eligible" },
      { name: "Reset · Apple Authorised Repair", address: "Sukhbaatar, Naadam St 5, 2nd floor", phone: "+976 7700-4488", distanceKm: 0.9, rating: 4.6, note: "Same-day diagnostic" },
    ],
  },
};
