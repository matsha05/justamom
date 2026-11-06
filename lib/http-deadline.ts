/** Bound the whole operation, including response consumption, to one deadline. */
export async function withRequestDeadline<T>(
  operation: (signal: AbortSignal) => Promise<T>,
  timeoutMs: number,
  callerSignal?: AbortSignal | null
): Promise<T> {
  if (callerSignal?.aborted) {
    throw callerSignal.reason;
  }

  const controller = new AbortController();
  let rejectCancellation!: (reason: unknown) => void;
  const cancelled = new Promise<never>((_, reject) => {
    rejectCancellation = reject;
  });
  const cancel = (reason: unknown) => {
    // Reject first: a consumer may catch an aborted body read and return null.
    // Cancellation must still win over that apparent successful completion.
    rejectCancellation(reason);
    controller.abort(reason);
  };
  const handleCallerAbort = () => cancel(callerSignal?.reason);
  callerSignal?.addEventListener("abort", handleCallerAbort, { once: true });
  const timeout = setTimeout(() => {
    cancel(new DOMException("The request timed out.", "TimeoutError"));
  }, timeoutMs);

  try {
    const result = await Promise.race([operation(controller.signal), cancelled]);
    controller.signal.throwIfAborted();
    return result;
  } finally {
    clearTimeout(timeout);
    callerSignal?.removeEventListener("abort", handleCallerAbort);
  }
}
