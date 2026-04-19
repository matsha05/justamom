import { describe, expect, it } from "vitest";
import { splitNoteContent } from "@/lib/note-content";

describe("splitNoteContent", () => {
  it("removes a trailing author sign-off from the rendered body", () => {
    const result = splitNoteContent(`Hey friend,\n\nBody copy.\n\nIn it with you,\nLizi\n`);

    expect(result.body).toBe("Hey friend,\n\nBody copy.\n");
    expect(result.postscript).toBeNull();
  });

  it("preserves postscript content after the shared sign-off", () => {
    const result = splitNoteContent(
      `Hey friend,\n\nBody copy.\n\nIn it with you,\nLizi\n\n**P.S.** Forward this to a friend.\n`
    );

    expect(result.body).toBe("Hey friend,\n\nBody copy.\n");
    expect(result.postscript).toBe("**P.S.** Forward this to a friend.\n");
  });

  it("leaves notes without the author sign-off untouched", () => {
    const result = splitNoteContent("Hey friend,\n\nBody copy.\n");

    expect(result.body).toBe("Hey friend,\n\nBody copy.\n");
    expect(result.postscript).toBeNull();
  });
});
