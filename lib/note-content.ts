export interface NoteContentSections {
  body: string;
  postscript: string | null;
}

export function splitNoteContent(content: string): NoteContentSections {
  const trimmed = content.trimEnd();
  const signOffPattern = /(?:^|\n)\s*In it with you,\s*\n\s*Lizi\s*(?=\n|$)/i;
  const match = signOffPattern.exec(trimmed);

  if (!match) {
    return {
      body: trimmed ? `${trimmed}\n` : "",
      postscript: null,
    };
  }

  const body = trimmed.slice(0, match.index).trimEnd();
  const postscript = trimmed.slice(match.index + match[0].length).trim();

  return {
    body: body ? `${body}\n` : "",
    postscript: postscript ? `${postscript}\n` : null,
  };
}
