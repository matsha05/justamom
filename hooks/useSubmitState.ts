"use client";

import { useState } from "react";

export type SubmitState =
  | { status: "idle" | "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export type SubmitStatus = SubmitState["status"];

export function useSubmitState() {
  const [state, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const { status } = state;

  return {
    status,
    setSubmitState,
    successMessage: state.status === "success" ? state.message : null,
    errorMessage: state.status === "error" ? state.message : null,
    isSubmitting: status === "submitting",
    isSuccess: status === "success",
    isError: status === "error",
  };
}
