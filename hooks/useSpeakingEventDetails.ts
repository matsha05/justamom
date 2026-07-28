"use client";

import { useState } from "react";

const MISSING_DETAILS_MESSAGE = "Please select an event type and group size.";

export function useSpeakingEventDetails() {
  const [eventType, setEventType] = useState("");
  const [audienceSize, setAudienceSize] = useState("");
  const [selectError, setSelectError] = useState<string | null>(null);

  function updateEventType(value: string) {
    setEventType(value);
    setSelectError(null);
  }

  function updateAudienceSize(value: string) {
    setAudienceSize(value);
    setSelectError(null);
  }

  function validateRequiredDetails() {
    if (eventType && audienceSize) {
      setSelectError(null);
      return true;
    }

    setSelectError(MISSING_DETAILS_MESSAGE);
    return false;
  }

  function clearValidationError() {
    setSelectError(null);
  }

  function resetDetails() {
    setEventType("");
    setAudienceSize("");
    setSelectError(null);
  }

  return {
    eventType,
    audienceSize,
    selectError,
    updateEventType,
    updateAudienceSize,
    validateRequiredDetails,
    clearValidationError,
    resetDetails,
  };
}
