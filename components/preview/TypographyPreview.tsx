import type { CSSProperties } from "react";
import Link from "next/link";
import styles from "./TypographyPreview.module.css";

type TextStyleToken = {
  name: string;
  fontFamily: string;
  fontWeight: string;
  desktop: string;
  mobile: string;
  lineHeight: string;
  tracking: string;
  usage: string;
};

type ColorToken = {
  name: string;
  value: string;
  usage: string;
};

type HandoffSpec = {
  namespace: string;
  textStyles: TextStyleToken[];
  spacing: string[];
  radius: string[];
  buttons: string[];
  colors: ColorToken[];
};

type ScoreAxisKey =
  | "scripturalTrust"
  | "maternalWarmth"
  | "readingStamina"
  | "invitationClarity"
  | "editorialDistinctiveness";

type ScoreAxis = {
  key: ScoreAxisKey;
  label: string;
  weight: number;
};

type Concept = {
  id: string;
  label: string;
  title: string;
  pairing: string;
  tone: string;
  hero: string;
  dek: string;
  primaryCta: string;
  secondaryCta: string;
  rationale: string;
  sampleDisplay: string;
  sampleHeading: string;
  sampleBody: string;
  typeMeta: string;
  metrics: {
    display: string;
    heading: string;
    body: string;
    label: string;
  };
  scores: Record<ScoreAxisKey, number>;
  scoreEvidence: Record<ScoreAxisKey, string>;
  handoff: HandoffSpec;
  style: Record<string, string>;
};

const concepts: Concept[] = [
  {
    id: "A",
    label: "Quiet Editorial",
    title: "A Note for Moms",
    pairing: "Newsreader + Source Sans 3",
    tone: "Warm, steady, literary",
    hero: "Motherhood is not a footnote.",
    dek: "Some seasons are loud with pressure to prove yourself. This direction answers with clarity, breathing room, and emotional gravity. The work may be hidden, but it is never small.",
    primaryCta: "Join A Note for Moms",
    secondaryCta: "Read all notes",
    rationale:
      "Calm literary serif with highly legible body text. Strong for trust, longevity, and devotional reading.",
    sampleDisplay: "You are not just a mom.",
    sampleHeading: "What culture calls small, God calls faithful.",
    sampleBody:
      "Body copy stays airy at 18/30 with moderate contrast so long-form notes remain easy to read on mobile and desktop.",
    typeMeta: "Display 500, Heading 500, Body 400, Labels 700",
    metrics: {
      display: "clamp(32-78px) / 1.03 / -0.025em",
      heading: "clamp(16-20px) / 1.22 / -0.01em",
      body: "18/30 lead, 400",
      label: "12/15, uppercase, +0.18em",
    },
    scores: {
      scripturalTrust: 9.4,
      maternalWarmth: 8.9,
      readingStamina: 9.2,
      invitationClarity: 8.8,
      editorialDistinctiveness: 8.3,
    },
    scoreEvidence: {
      scripturalTrust:
        "Most pastoral voice and lowest rhetoric in hero/dek copy, which fits faith-forward trust.",
      maternalWarmth:
        "Supportive and gentle tone; slightly more formal than conversational mom language.",
      readingStamina:
        "18/30 body rhythm and restrained contrast are strongest for long devotional reading.",
      invitationClarity:
        "CTA verbs are clear and specific, but less directional than action-led alternatives.",
      editorialDistinctiveness:
        "Elegant and proven, but visually closer to many existing editorial stacks.",
    },
    handoff: {
      namespace: "A/Typography/*, A/Color/*, A/Space/*, A/Radius/*, A/Button/*",
      textStyles: [
        {
          name: "A/Typography/Display/XL",
          fontFamily: "Newsreader",
          fontWeight: "500",
          desktop: "78px",
          mobile: "36px",
          lineHeight: "103%",
          tracking: "-2.5%",
          usage: "Hero statement",
        },
        {
          name: "A/Typography/Heading/L",
          fontFamily: "Newsreader",
          fontWeight: "500",
          desktop: "28px",
          mobile: "20px",
          lineHeight: "122%",
          tracking: "-1%",
          usage: "Section headings",
        },
        {
          name: "A/Typography/Body/M",
          fontFamily: "Source Sans 3",
          fontWeight: "400",
          desktop: "18px",
          mobile: "17px",
          lineHeight: "167%",
          tracking: "0%",
          usage: "Body paragraphs",
        },
        {
          name: "A/Typography/Label/S",
          fontFamily: "Source Sans 3",
          fontWeight: "700",
          desktop: "12px",
          mobile: "12px",
          lineHeight: "125%",
          tracking: "+18%",
          usage: "Eyebrows and tags",
        },
      ],
      spacing: ["A/Space/2=8", "A/Space/3=12", "A/Space/4=16", "A/Space/6=24", "A/Space/8=32", "A/Space/12=48", "A/Space/18=72"],
      radius: ["A/Radius/Sm=8", "A/Radius/Md=12", "A/Radius/Lg=18", "A/Radius/Pill=999"],
      buttons: [
        "A/Button/Primary: 48h, 20x12, fill Accent, weight 650",
        "A/Button/Secondary: 48h, 20x12, 1px border, weight 650",
      ],
      colors: [
        { name: "A/Color/Surface", value: "#F9F4ED", usage: "Main panel background" },
        { name: "A/Color/Panel", value: "rgba(255,255,255,0.72)", usage: "Specimen card" },
        { name: "A/Color/Ink", value: "#1F1A15", usage: "Primary text" },
        { name: "A/Color/Accent", value: "#2F6058", usage: "Primary CTA" },
      ],
    },
    style: {
      "--stage-bg": "#f9f4ed",
      "--stage-panel": "rgba(255, 255, 255, 0.72)",
      "--stage-ink": "#1f1a15",
      "--stage-soft": "#4f463d",
      "--stage-accent": "#2f6058",
      "--stage-border": "rgba(31, 26, 21, 0.16)",
      "--stage-heading-font": "var(--font-preview-newsreader), Georgia, serif",
      "--stage-body-font": "var(--font-preview-source-sans-3), system-ui, sans-serif",
      "--stage-display-weight": "500",
      "--stage-subheading-weight": "500",
      "--stage-body-weight": "400",
      "--stage-body-lg-size": "clamp(1.08rem, 0.96rem + 0.56vw, 1.3rem)",
      "--stage-body-size": "1.02rem",
      "--stage-display-line-height": "1.03",
      "--stage-display-tracking": "-0.025em",
      "--stage-wordmark-spacing": "0.2em",
      "--stage-tag-spacing": "0.18em",
      "--stage-button-radius": "999px",
      "--stage-glow":
        "radial-gradient(circle at 15% 10%, rgba(65, 109, 103, 0.2), transparent 52%)",
    },
  },
  {
    id: "B",
    label: "High Contrast",
    title: "Just a Mom",
    pairing: "Fraunces + Manrope",
    tone: "Bold, declarative, campaign-like",
    hero: "You are not just a mom.",
    dek: "The phrase sounds ordinary until you trace what it actually holds: intercession, formation, sacrifice, delight, and endurance. This direction is built for stronger narrative tension and sharper visual contrast.",
    primaryCta: "Start reading",
    secondaryCta: "Explore the project",
    rationale:
      "Expressive variable serif with a grounded geometric sans. Strong contrast and assertive rhythm.",
    sampleDisplay: "A calling, not a consequence.",
    sampleHeading: "Strength in typography without losing warmth.",
    sampleBody:
      "Body copy runs at 17/28 with tighter tracking to keep modern density while preserving scan speed for CTAs and intros.",
    typeMeta: "Display 600, Heading 560, Body 450, Labels 700",
    metrics: {
      display: "clamp(32-78px) / 0.97 / -0.03em",
      heading: "clamp(16-20px) / 1.22 / -0.01em",
      body: "17/28 lead, 450",
      label: "12/15, uppercase, +0.20em",
    },
    scores: {
      scripturalTrust: 8.6,
      maternalWarmth: 7.9,
      readingStamina: 8.4,
      invitationClarity: 9.1,
      editorialDistinctiveness: 9.3,
    },
    scoreEvidence: {
      scripturalTrust:
        "Copy is powerful and assertive, but less contemplative than a ministry-first cadence.",
      maternalWarmth:
        "Highest contrast and campaign energy can read less nurturing for tired-mom contexts.",
      readingStamina:
        "17/28 rhythm is good but denser in long passages than A/C.",
      invitationClarity:
        "Best CTA directness with strong action language and quick scanability.",
      editorialDistinctiveness:
        "Most memorable typographic personality and strongest brand separation.",
    },
    handoff: {
      namespace: "B/Typography/*, B/Color/*, B/Space/*, B/Radius/*, B/Button/*",
      textStyles: [
        {
          name: "B/Typography/Display/XL",
          fontFamily: "Fraunces",
          fontWeight: "600",
          desktop: "78px",
          mobile: "36px",
          lineHeight: "97%",
          tracking: "-3%",
          usage: "Hero statement",
        },
        {
          name: "B/Typography/Heading/L",
          fontFamily: "Fraunces",
          fontWeight: "560",
          desktop: "28px",
          mobile: "20px",
          lineHeight: "122%",
          tracking: "-1%",
          usage: "Section headings",
        },
        {
          name: "B/Typography/Body/M",
          fontFamily: "Manrope",
          fontWeight: "450",
          desktop: "17px",
          mobile: "16px",
          lineHeight: "165%",
          tracking: "0%",
          usage: "Body paragraphs",
        },
        {
          name: "B/Typography/Label/S",
          fontFamily: "Manrope",
          fontWeight: "700",
          desktop: "12px",
          mobile: "12px",
          lineHeight: "125%",
          tracking: "+20%",
          usage: "Eyebrows and tags",
        },
      ],
      spacing: ["B/Space/2=8", "B/Space/3=12", "B/Space/4=16", "B/Space/6=24", "B/Space/8=32", "B/Space/12=48", "B/Space/18=72"],
      radius: ["B/Radius/Sm=8", "B/Radius/Md=12", "B/Radius/Lg=18", "B/Radius/Button=14"],
      buttons: [
        "B/Button/Primary: 48h, 20x12, fill Accent, weight 650",
        "B/Button/Secondary: 48h, 20x12, 1px border, weight 650",
      ],
      colors: [
        { name: "B/Color/Surface", value: "#F3EEE6", usage: "Main panel background" },
        { name: "B/Color/Panel", value: "rgba(255,255,255,0.70)", usage: "Specimen card" },
        { name: "B/Color/Ink", value: "#181514", usage: "Primary text" },
        { name: "B/Color/Accent", value: "#114B46", usage: "Primary CTA" },
      ],
    },
    style: {
      "--stage-bg": "#f3eee6",
      "--stage-panel": "rgba(255, 255, 255, 0.7)",
      "--stage-ink": "#181514",
      "--stage-soft": "#453f38",
      "--stage-accent": "#114b46",
      "--stage-border": "rgba(24, 21, 20, 0.2)",
      "--stage-heading-font": "var(--font-preview-fraunces), Georgia, serif",
      "--stage-body-font": "var(--font-preview-manrope), system-ui, sans-serif",
      "--stage-display-weight": "600",
      "--stage-subheading-weight": "560",
      "--stage-body-weight": "450",
      "--stage-body-lg-size": "clamp(1.03rem, 0.94rem + 0.5vw, 1.22rem)",
      "--stage-body-size": "1rem",
      "--stage-display-line-height": "0.97",
      "--stage-display-tracking": "-0.03em",
      "--stage-wordmark-spacing": "0.26em",
      "--stage-tag-spacing": "0.2em",
      "--stage-button-radius": "14px",
      "--stage-glow":
        "radial-gradient(circle at 84% 12%, rgba(17, 75, 70, 0.18), transparent 52%)",
    },
  },
  {
    id: "C",
    label: "Literary Modern",
    title: "A Different Kind of New Year",
    pairing: "Literata + Plus Jakarta Sans",
    tone: "Refined, modern, publishing-grade",
    hero: "Just a mom is never the whole story.",
    dek: "There is intelligence in daily faithfulness that rarely gets named. This direction blends literary authority with contemporary clarity so notes, essays, and speaking pages share one coherent voice.",
    primaryCta: "Read this week's note",
    secondaryCta: "Invite Lizi to speak",
    rationale:
      "Publishing-grade serif paired with a clean sans that scales especially well in navigation and forms.",
    sampleDisplay: "The ordinary day can still be sacred.",
    sampleHeading: "Editorial confidence with softer movement.",
    sampleBody:
      "Body runs at 18/31 with open counters and calmer texture, making long-form devotionals and testimonials feel effortless.",
    typeMeta: "Display 570, Heading 550, Body 430, Labels 700",
    metrics: {
      display: "clamp(32-78px) / 1.01 / -0.02em",
      heading: "clamp(16-20px) / 1.22 / -0.01em",
      body: "18/31 lead, 430",
      label: "12/15, uppercase, +0.19em",
    },
    scores: {
      scripturalTrust: 9.0,
      maternalWarmth: 9.4,
      readingStamina: 9.4,
      invitationClarity: 8.7,
      editorialDistinctiveness: 8.9,
    },
    scoreEvidence: {
      scripturalTrust:
        "Measured, grounded tone with reflective phrasing that still feels doctrinally safe.",
      maternalWarmth:
        "Most compassionate and human phrasing in hero/dek without sounding sentimental.",
      readingStamina:
        "18/31 rhythm plus calmer texture makes this easiest for sustained note reading.",
      invitationClarity:
        "CTAs are clear but split between note-reading and speaking, so focus is slightly diluted.",
      editorialDistinctiveness:
        "Distinct from generic SaaS visuals while remaining conservative enough for broad trust.",
    },
    handoff: {
      namespace: "C/Typography/*, C/Color/*, C/Space/*, C/Radius/*, C/Button/*",
      textStyles: [
        {
          name: "C/Typography/Display/XL",
          fontFamily: "Literata",
          fontWeight: "570",
          desktop: "78px",
          mobile: "36px",
          lineHeight: "101%",
          tracking: "-2%",
          usage: "Hero statement",
        },
        {
          name: "C/Typography/Heading/L",
          fontFamily: "Literata",
          fontWeight: "550",
          desktop: "28px",
          mobile: "20px",
          lineHeight: "122%",
          tracking: "-1%",
          usage: "Section headings",
        },
        {
          name: "C/Typography/Body/M",
          fontFamily: "Plus Jakarta Sans",
          fontWeight: "430",
          desktop: "18px",
          mobile: "17px",
          lineHeight: "172%",
          tracking: "0%",
          usage: "Body paragraphs",
        },
        {
          name: "C/Typography/Label/S",
          fontFamily: "Plus Jakarta Sans",
          fontWeight: "700",
          desktop: "12px",
          mobile: "12px",
          lineHeight: "125%",
          tracking: "+19%",
          usage: "Eyebrows and tags",
        },
      ],
      spacing: ["C/Space/2=8", "C/Space/3=12", "C/Space/4=16", "C/Space/6=24", "C/Space/8=32", "C/Space/12=48", "C/Space/18=72"],
      radius: ["C/Radius/Sm=8", "C/Radius/Md=12", "C/Radius/Lg=18", "C/Radius/Pill=999"],
      buttons: [
        "C/Button/Primary: 48h, 20x12, fill Accent, weight 650",
        "C/Button/Secondary: 48h, 20x12, 1px border, weight 650",
      ],
      colors: [
        { name: "C/Color/Surface", value: "#F4F0EA", usage: "Main panel background" },
        { name: "C/Color/Panel", value: "rgba(255,255,255,0.74)", usage: "Specimen card" },
        { name: "C/Color/Ink", value: "#1A1715", usage: "Primary text" },
        { name: "C/Color/Accent", value: "#5A6F45", usage: "Primary CTA" },
      ],
    },
    style: {
      "--stage-bg": "#f4f0ea",
      "--stage-panel": "rgba(255, 255, 255, 0.74)",
      "--stage-ink": "#1a1715",
      "--stage-soft": "#504741",
      "--stage-accent": "#5a6f45",
      "--stage-border": "rgba(26, 23, 21, 0.18)",
      "--stage-heading-font": "var(--font-preview-literata), Georgia, serif",
      "--stage-body-font": "var(--font-preview-plus-jakarta-sans), system-ui, sans-serif",
      "--stage-display-weight": "570",
      "--stage-subheading-weight": "550",
      "--stage-body-weight": "430",
      "--stage-body-lg-size": "clamp(1.06rem, 0.95rem + 0.54vw, 1.26rem)",
      "--stage-body-size": "1.02rem",
      "--stage-display-line-height": "1.01",
      "--stage-display-tracking": "-0.02em",
      "--stage-wordmark-spacing": "0.22em",
      "--stage-tag-spacing": "0.19em",
      "--stage-button-radius": "999px",
      "--stage-glow":
        "radial-gradient(circle at 16% 85%, rgba(90, 111, 69, 0.18), transparent 56%)",
    },
  },
];

const scoreAxes: ScoreAxis[] = [
  { key: "invitationClarity", label: "Invitation clarity", weight: 30 },
  { key: "scripturalTrust", label: "Scriptural trust", weight: 26 },
  { key: "maternalWarmth", label: "Maternal warmth", weight: 22 },
  { key: "readingStamina", label: "Reading stamina", weight: 17 },
  { key: "editorialDistinctiveness", label: "Editorial distinctiveness", weight: 5 },
];

const weightedTotals = concepts.map((concept) => {
  const total = scoreAxes.reduce((sum, axis) => {
    return sum + (concept.scores[axis.key] * axis.weight) / 100;
  }, 0);

  return {
    id: concept.id,
    total: Number(total.toFixed(2)),
  };
});

const topScoringConceptId = weightedTotals.reduce((best, current) => {
  return current.total > best.total ? current : best;
}).id;

const weightedTotalByConcept = concepts.reduce<Record<string, number>>((acc, concept) => {
  const total = weightedTotals.find((item) => item.id === concept.id)?.total ?? 0;
  acc[concept.id] = total;
  return acc;
}, {});

const weightSummaryLabel = scoreAxes
  .map((axis) => `${axis.label} ${axis.weight}%`)
  .join(", ");

const scoreMethodology =
  "Scored from what is currently rendered here: hero statement, dek voice, CTA language, and displayed type rhythm.";

const summaryRows = [
  {
    label: "Pairing",
    value: concepts.map((concept) => concept.pairing),
  },
  {
    label: "Tone",
    value: concepts.map((concept) => concept.tone),
  },
  {
    label: "Body Rhythm",
    value: concepts.map((concept) => concept.metrics.body),
  },
  {
    label: "Display Setup",
    value: concepts.map((concept) => concept.metrics.display),
  },
  {
    label: "Weight Strategy",
    value: concepts.map((concept) => concept.typeMeta),
  },
  {
    label: "Figma Namespace",
    value: concepts.map((concept) => concept.handoff.namespace),
  },
];

export function TypographyPreview() {
  return (
    <section className={styles.shell}>
      <div className={styles.frame}>
        <header className={styles.headerCard}>
          <p className={styles.eyebrow}>Typography Direction Preview</p>
          <h1 className={styles.headerTitle}>Three complete systems, one page, direct comparison</h1>
          <p className={styles.headerBody}>
            Every concept is shown at production-like scale with real copy, spacing rhythm, and weight hierarchy.
            This is built to evaluate craft and hand off without translation work.
          </p>
          <p className={styles.selectedDirection}>
            Selected production direction: Concept C base with Concept A trust-tone refinements.
          </p>
          <div className={styles.jumpRow}>
            <a href="#concept-a" className={styles.jumpPill}>
              Concept A
            </a>
            <a href="#concept-b" className={styles.jumpPill}>
              Concept B
            </a>
            <a href="#concept-c" className={styles.jumpPill}>
              Concept C
            </a>
            <a href="#handoff-notes" className={styles.jumpPill}>
              Handoff Notes
            </a>
          </div>
          <div className={styles.downloadRow}>
            <a href="/preview/figma-typography-handoff.json" className={styles.downloadLink}>
              Download token JSON
            </a>
            <a href="/preview/figma-typography-handoff.csv" className={styles.downloadLink}>
              Download text style CSV
            </a>
            <a href="/preview/justamom-design-system-v1.json" className={styles.downloadLink}>
              Download production system JSON
            </a>
            <a href="/preview/justamom-design-system-v1.csv" className={styles.downloadLink}>
              Download production system CSV
            </a>
          </div>
        </header>

        <section className={styles.summaryCard} aria-label="System comparison matrix">
          <h2 className={styles.summaryTitle}>Comparison Matrix</h2>
          <div className={styles.summaryScroll}>
            <table className={styles.summaryTable}>
              <thead>
                <tr>
                  <th scope="col">Dimension</th>
                  {concepts.map((concept) => (
                    <th key={`head-${concept.id}`} scope="col">
                      {concept.id}. {concept.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {summaryRows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {row.value.map((item, index) => (
                      <td key={`${row.label}-${concepts[index].id}`}>{item}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={styles.scoreCard} aria-label="Weighted score matrix">
          <div className={styles.scoreHeader}>
            <h2 className={styles.summaryTitle}>Weighted score matrix</h2>
            <p className={styles.scoreWeightText}>Weights: {weightSummaryLabel}</p>
            <p className={styles.scoreMethodText}>Method: {scoreMethodology}</p>
          </div>
          <div className={styles.scoreScroll}>
            <table className={styles.scoreTable}>
              <thead>
                <tr>
                  <th scope="col">Axis</th>
                  {concepts.map((concept) => (
                    <th key={`score-head-${concept.id}`} scope="col">
                      {concept.pairing}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scoreAxes.map((axis) => (
                  <tr key={axis.key}>
                    <th scope="row">{axis.label}</th>
                    {concepts.map((concept) => {
                      const score = concept.scores[axis.key];

                      return (
                        <td key={`${axis.key}-${concept.id}`}>
                          <div className={styles.scoreCell}>
                            <div className={styles.scoreBarRow}>
                              <span className={styles.scoreValue}>{score.toFixed(1)}</span>
                              <span className={styles.scoreTrack} aria-hidden="true">
                                <span
                                  className={styles.scoreFill}
                                  style={{ width: `${score * 10}%` }}
                                />
                              </span>
                            </div>
                            <p className={styles.scoreEvidence}>{concept.scoreEvidence[axis.key]}</p>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className={styles.scoreTotalRow}>
                  <th scope="row">Weighted total</th>
                  {concepts.map((concept) => {
                    const total = weightedTotalByConcept[concept.id];
                    const isTop = concept.id === topScoringConceptId;

                    return (
                      <td key={`weighted-total-${concept.id}`}>
                        <div className={styles.scoreTotalCell}>
                          <span className={styles.scoreTotalValue}>{total.toFixed(2)}</span>
                          {isTop ? <span className={styles.scoreTopBadge}>Top</span> : null}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className={styles.conceptStack}>
          {concepts.map((concept) => {
            const stageStyle = concept.style as CSSProperties;

            return (
              <article
                key={concept.id}
                id={`concept-${concept.id.toLowerCase()}`}
                className={styles.stage}
                style={stageStyle}
              >
                <div className={styles.stageInner}>
                  <div className={styles.stageHead}>
                    <p className={styles.stageHeadTag}>Concept {concept.id}</p>
                    <h2 className={styles.stageHeadTitle}>{concept.title}</h2>
                    <p className={styles.stageHeadPair}>{concept.pairing}</p>
                  </div>

                  <div className={styles.heroGrid}>
                    <div className={styles.heroBlock}>
                      <p className={styles.wordmark}>Issue One - Just a Mom</p>
                      <h3 className={styles.heroTitle}>{concept.hero}</h3>
                      <p className={styles.heroDek}>
                        {concept.dek} <strong>You are not just a mom.</strong>
                      </p>

                      <div className={styles.ctaRow}>
                        <Link href="/" className={styles.primaryCta}>
                          {concept.primaryCta}
                        </Link>
                        <Link href="/notes" className={styles.secondaryCta}>
                          {concept.secondaryCta}
                        </Link>
                      </div>
                    </div>

                    <aside className={styles.typeCard}>
                      <p className={styles.typeCardTitle}>Type Specimen</p>
                      <ul className={styles.sampleList}>
                        <li>
                          <p className={styles.sampleLabel}>Display</p>
                          <p className={`${styles.sampleValue} ${styles.sampleDisplay}`}>
                            {concept.sampleDisplay}
                          </p>
                        </li>
                        <li>
                          <p className={styles.sampleLabel}>Heading</p>
                          <p className={`${styles.sampleValue} ${styles.sampleHeading}`}>
                            {concept.sampleHeading}
                          </p>
                        </li>
                        <li>
                          <p className={styles.sampleLabel}>Body</p>
                          <p className={`${styles.sampleValue} ${styles.sampleBody}`}>{concept.sampleBody}</p>
                        </li>
                      </ul>

                      <dl className={styles.metricGrid}>
                        <div>
                          <dt>Display</dt>
                          <dd>{concept.metrics.display}</dd>
                        </div>
                        <div>
                          <dt>Heading</dt>
                          <dd>{concept.metrics.heading}</dd>
                        </div>
                        <div>
                          <dt>Body</dt>
                          <dd>{concept.metrics.body}</dd>
                        </div>
                        <div>
                          <dt>Label</dt>
                          <dd>{concept.metrics.label}</dd>
                        </div>
                      </dl>
                    </aside>
                  </div>

                  <section className={styles.handoffCard} aria-label={`Figma handoff for concept ${concept.id}`}>
                    <div className={styles.handoffHead}>
                      <h3 className={styles.handoffTitle}>Figma handoff</h3>
                      <p className={styles.handoffNamespace}>{concept.handoff.namespace}</p>
                    </div>

                    <div className={styles.handoffGrid}>
                      <div className={styles.tokenPanel}>
                        <p className={styles.tokenPanelTitle}>Text styles</p>
                        <div className={styles.tokenScroll}>
                          <table className={styles.tokenTable}>
                            <thead>
                              <tr>
                                <th scope="col">Style</th>
                                <th scope="col">Font</th>
                                <th scope="col">Weight</th>
                                <th scope="col">Desktop</th>
                                <th scope="col">Mobile</th>
                                <th scope="col">Line</th>
                                <th scope="col">Track</th>
                                <th scope="col">Usage</th>
                              </tr>
                            </thead>
                            <tbody>
                              {concept.handoff.textStyles.map((token) => (
                                <tr key={token.name}>
                                  <td>{token.name}</td>
                                  <td>{token.fontFamily}</td>
                                  <td>{token.fontWeight}</td>
                                  <td>{token.desktop}</td>
                                  <td>{token.mobile}</td>
                                  <td>{token.lineHeight}</td>
                                  <td>{token.tracking}</td>
                                  <td>{token.usage}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className={styles.tokenPanel}>
                        <p className={styles.tokenPanelTitle}>Core tokens</p>
                        <div className={styles.tokenGroup}>
                          <p className={styles.tokenGroupTitle}>Spacing</p>
                          <div className={styles.chipWrap}>
                            {concept.handoff.spacing.map((token) => (
                              <span key={token} className={styles.tokenChip}>
                                {token}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className={styles.tokenGroup}>
                          <p className={styles.tokenGroupTitle}>Radius</p>
                          <div className={styles.chipWrap}>
                            {concept.handoff.radius.map((token) => (
                              <span key={token} className={styles.tokenChip}>
                                {token}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className={styles.tokenGroup}>
                          <p className={styles.tokenGroupTitle}>Buttons</p>
                          <ul className={styles.inlineList}>
                            {concept.handoff.buttons.map((token) => (
                              <li key={token}>{token}</li>
                            ))}
                          </ul>
                        </div>

                        <div className={styles.tokenGroup}>
                          <p className={styles.tokenGroupTitle}>Colors</p>
                          <ul className={styles.inlineList}>
                            {concept.handoff.colors.map((token) => (
                              <li key={token.name}>
                                <strong>{token.name}</strong>: {token.value} ({token.usage})
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </section>

                  <footer className={styles.foot}>
                    <p className={styles.footMeta}>{concept.rationale}</p>
                    <p className={styles.footMeta}>{concept.typeMeta}</p>
                  </footer>
                </div>
              </article>
            );
          })}
        </div>

        <section id="handoff-notes" className={styles.handoffNotesCard}>
          <h2 className={styles.summaryTitle}>Figma-ready handoff checklist</h2>
          <ol className={styles.checklist}>
            <li>Create three pages in Figma: Concept A, Concept B, Concept C.</li>
            <li>Import text styles using the exact style names shown in each concept table.</li>
            <li>Create color styles and numeric spacing variables from the token lists.</li>
            <li>Create button components from the button specs and map them to semantic variants.</li>
            <li>Pin desktop and mobile variants for each hero section before choosing the final direction.</li>
          </ol>
        </section>
      </div>
    </section>
  );
}
