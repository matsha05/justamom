# Speaking Topic Illustration Workflow

## Overview

A two-part system for generating cohesive, premium illustrations for lizishaw.com speaking topics.

---

## Part 1: Creative Direction (LLM)

Use this prompt to extract visual elements from a topic summary:

```
You are a creative director for a premium Christian motherhood brand.

Given this speaking topic, provide a creative brief for an illustration:

TOPIC: [Title]
SUMMARY: [Description]

Output the following in this exact format:

SUBJECT: [1-2 figures, describe pose and interaction]
ACTION: [What are they doing? Be specific about body language]
SETTING: [Simple environment - indoor/outdoor, key furniture or props]
MOOD: [Emotional atmosphere - peaceful, joyful, intimate, restful]
BOTANICAL: [One accent plant that matches the mood]
LIGHTING: [Time of day and light quality]
```

---

## Part 2: Image Generation

### Prompt Structure (follow this exact order)

```
[MEDIUM], [SUBJECT doing ACTION], [SETTING]. [LIGHTING]. [STYLE]. [COMPOSITION]. [EXCLUSIONS].
```

### Locked Parameters

| Element | Value |
|---------|-------|
| **Medium** | Soft pencil line illustration with delicate watercolor wash |
| **Style** | Editorial illustration, children's book aesthetic, New Yorker magazine influence |
| **Palette** | Muted sage green, dusty rose, warm cream, soft teal (#4a7c7c) |
| **Faces** | Simplified, minimal features, no detailed eyes or mouths |
| **Composition** | Square format, centered subject, generous negative space |
| **Exclusions** | No text, no logos, no words, no photorealistic faces |

### Master Template

```
Soft pencil line illustration with delicate watercolor wash. [SUBJECT from Part 1] [ACTION from Part 1], [SETTING from Part 1]. [LIGHTING from Part 1]. Editorial illustration style, children's book aesthetic with New Yorker magazine sophistication. Muted palette: sage green, dusty rose, warm cream, soft teal accents. Simplified faces with minimal features. [BOTANICAL from Part 1] as subtle accent. Square format, centered composition, generous white negative space. No text, no logos, no photorealistic faces.
```

---

## Current Topics

### 1. Mom Friends

**Part 1 Output:**
- Subject: Two women in their 30s
- Action: Sitting together at café table, leaning toward each other, holding coffee cups
- Setting: Cozy café table with simple chairs
- Mood: Warm, intimate, connected
- Botanical: Eucalyptus sprig
- Lighting: Soft natural daylight

**Part 2 Prompt:**
```
Soft pencil line illustration with delicate watercolor wash. Two women in their 30s sitting together at a cozy café table, leaning toward each other in friendly conversation, holding coffee cups. Simple café setting with two chairs. Soft natural daylight. Editorial illustration style, children's book aesthetic with New Yorker magazine sophistication. Muted palette: sage green, dusty rose, warm cream, soft teal accents. Simplified faces with minimal features. Small eucalyptus sprig on table as subtle accent. Square format, centered composition, generous white negative space. No text, no logos, no photorealistic faces.
```

---

### 2. Hope in the Unseen

**Part 1 Output:**
- Subject: A woman alone
- Action: Sitting by window with eyes gently closed, hands resting in lap
- Setting: Simple window with soft curtains
- Mood: Peaceful, prayerful, quiet
- Botanical: Olive branch in vase
- Lighting: Soft morning golden hour light streaming through window

**Part 2 Prompt:**
```
Soft pencil line illustration with delicate watercolor wash. A woman sitting peacefully by a window, eyes gently closed, hands resting in lap in quiet prayer. Simple window with soft curtains. Soft morning golden hour light streaming in. Editorial illustration style, children's book aesthetic with New Yorker magazine sophistication. Muted palette: sage green, dusty rose, warm cream, soft teal accents. Simplified faces with minimal features. Olive branch in simple vase nearby as subtle accent. Square format, centered composition, generous white negative space. No text, no logos, no photorealistic faces.
```

---

### 3. My Yoke is Easy

**Part 1 Output:**
- Subject: A woman alone
- Action: Curled up comfortably in armchair with open book, shoulders relaxed
- Setting: Cozy armchair, perhaps near window
- Mood: Restful, peaceful, unburdened
- Botanical: Peony flower
- Lighting: Warm afternoon light

**Part 2 Prompt:**
```
Soft pencil line illustration with delicate watercolor wash. A woman curled up comfortably in a cozy armchair with an open book, shoulders relaxed, peaceful expression. Simple armchair setting. Warm afternoon light. Editorial illustration style, children's book aesthetic with New Yorker magazine sophistication. Muted palette: sage green, dusty rose, warm cream, soft teal accents. Simplified faces with minimal features. Small peony flower in corner as subtle accent. Square format, centered composition, generous white negative space. No text, no logos, no photorealistic faces.
```

---

## Adding New Topics

1. Run **Part 1** with the new topic title and summary
2. Plug the output into the **Part 2 template**
3. Generate image
4. Save as `speaking-[topic-slug].png` in `/public/images/`
5. Add to `speakingTopics` array in `/app/speaking/page.tsx`
