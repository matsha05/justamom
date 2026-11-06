# State-machine fixes

Prepared against shared main `b20e184` while preserving its writing, book recommendations, dependency updates, and authored content. Unrelated unfinished work from the original local checkout is excluded.

| Area | Behavior |
| --- | --- |
| Request deduplication | Cache inspection and lock acquisition are atomic. Result writes and lock release check ownership atomically. New request records bind keys to stable parsed-content hashes; older records retain safe replay/in-progress behavior until expiry. |
| Forms | Contact, speaking, and newsletter submissions have synchronous pending guards. Pending drafts are locked, select/calendar edits explicitly invalidate request identity, and success/error feedback share one mutually exclusive state. Completions after unmount are ignored. |
| Contact delivery | An uncertain-outcome result is stored before sending. Ambiguous provider failures retain it instead of allowing the same request key to send again. Confirmed rejection clears it while ownership matches. Acknowledged success remains success if result persistence fails. |
| Request deadlines | Provider requests bound the fetch and any required response consumption to 8 seconds. Client requests use 25 seconds. Redis commands use fresh 5-second deadlines with no automatic retry; alerts use 3 seconds and report non-success HTTP responses. |
| Error finalization | API preparation returns controlled JSON on storage failure. Routes await finalization. Failed cleanup does not replace the error response. The book-recommendation route is updated for the shared cleanup signature and awaited finalization. |
| Navigation | Mobile menus close on pathname/history changes without restoring the prior trigger. Desktop Writing disclosure closes when entering mobile width. |
| Operational notifications | Missing-Redis warnings claim their latch before awaiting alert delivery, preventing concurrent duplicate startup alerts. |

Contact API requests require an `idempotency-key`; existing site forms already supply one. Reuse it for an unchanged retry and generate a new key after editing. Newsletter and book-recommendation endpoints retain their existing optional-key contract.

The provisional contact outcome is retained for 24 hours. Confirmed success replaces it with a 10-minute cached success response. A network failure, HTTP 408, or provider 5xx returns HTTP 409 with `code: "delivery_unknown"`, preserving the draft and directing the visitor to contact Lizi before sending again. No provider write is automatically retried. If reservation persistence fails before the provider call, owner-fenced cleanup removes any provisional result so a request that was never sent can be retried.

Deduplication covers the same retained key within its retention window. A new key, expired retention, lost storage, or a reload that loses the in-memory client key falls outside that guarantee. Durable protection across application instances requires Redis; use the existing `REQUIRE_REDIS=true` production setting. Memory fallback remains process-local. Provider accounts and hosting settings are unchanged.

The Redis deserialization setting is included because atomic replay expects the stored JSON string. The small form fieldset/pending-lock dependencies are included because safe retry identity depends on preserving the captured draft. Existing unrelated newsletter subscriber-status/group work, DatePicker behavior changes, author setup instructions, and photographs are excluded.

Validated with the branch's locked dependencies and Node 24.22.2: all 102 unit/API tests passed, lint and the design-system audit passed, and the standard Next.js production build passed TypeScript checking and generated all 45 pages. The production-browser suite passed 59 desktop/mobile checks, with 7 intentional device-specific skips. A final request-hash correction was covered by unit/API regression tests and a fresh production build after the browser run.

Provider calls are mocked. Redis tests exercise the real SDK with mocked REST transport and the equivalent memory transitions; they do not execute Lua against a live Redis instance. The book-form regression verifies that changing the first of several duplicate field values conflicts with the original request key without making another provider call.
