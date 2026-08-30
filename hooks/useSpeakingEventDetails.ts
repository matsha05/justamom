"use client";

import { useState } from "react";

export interface SpeakingEventDetails {
  organization: string;
  eventDate: string;
  location: string;
  eventType: string;
  audienceSize: string;
  message: string;
}

export type SpeakingEventDetail = keyof SpeakingEventDetails;

const emptyDetails: SpeakingEventDetails = {
  organization: "",
  eventDate: "",
  location: "",
  eventType: "",
  audienceSize: "",
  message: "",
};

export function useSpeakingEventDetails() {
  const [details, setDetails] = useState<SpeakingEventDetails>(emptyDetails);

  function updateDetail(field: SpeakingEventDetail, value: string) {
    setDetails((currentDetails) => ({
      ...currentDetails,
      [field]: value,
    }));
  }

  function resetDetails() {
    setDetails(emptyDetails);
  }

  return {
    details,
    updateDetail,
    resetDetails,
  };
}
