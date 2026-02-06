export interface SelectOption {
  value: string;
  label: string;
}

export const contactSubjectOptions: SelectOption[] = [
  { value: "Speaking Inquiry", label: "Speaking Inquiry" },
  { value: "Collaboration", label: "Collaboration" },
  { value: "Just Saying Hello", label: "Just Saying Hello" },
  { value: "Something Else", label: "Something Else" },
];

export const speakingEventTypeOptions: SelectOption[] = [
  { value: "Bible Study / Small Group", label: "Bible Study / Small Group" },
  { value: "Retreat", label: "Retreat" },
  { value: "MomCo", label: "MomCo" },
  { value: "Conference", label: "Conference" },
  { value: "Sunday Service", label: "Sunday Service" },
  { value: "Workshop", label: "Workshop" },
  { value: "Virtual Event", label: "Virtual Event" },
  { value: "Other", label: "Other" },
];

export const speakingAudienceSizeOptions: SelectOption[] = [
  { value: "Small Group (< 20)", label: "Small Group (< 20)" },
  { value: "20-50", label: "20 - 50" },
  { value: "50-150", label: "50 - 150" },
  { value: "150+", label: "150+" },
];

export interface SpeakingTopic {
  title: string;
  description: string;
}

export const speakingTopics: SpeakingTopic[] = [
  {
    title: "Identity in the Noise",
    description:
      "A steadying look at the cultural pressure points shaping modern motherhood and how to live from a secure identity instead of performance.",
  },
  {
    title: "Finding God in the Ordinary",
    description:
      "A reflective message about the sacred weight of everyday motherhood and the quiet faithfulness that carries it.",
  },
  {
    title: "A Calling, Not a Consequence",
    description:
      "A biblical reframe that restores dignity to motherhood without diminishing calling, gifts, or work outside the home.",
  },
];

export const newsletterCtaCopy = {
  heading: "A Note for Moms, twice a month.",
  description:
    "Sent twice a month: honest stories and biblical reminders to keep moms grounded in truth over cultural noise.",
  button: "Join A Note for Moms",
} as const;
