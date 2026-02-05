"use client";

import { useState } from "react";

export type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function useSubmitState(initialStatus: SubmitStatus = "idle") {
  const [status, setStatus] = useState<SubmitStatus>(initialStatus);

  return {
    status,
    setStatus,
    isSubmitting: status === "submitting",
    isSuccess: status === "success",
    isError: status === "error",
  };
}
