import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { getRequestHash } from "@/lib/server/idempotency-request";

const requestUrl = "https://lizishaw.com/api/contact";

function jsonRequest(body: string): NextRequest {
  return new NextRequest(requestUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
}

function multipartRequest(fields: [string, string][], boundary: string): NextRequest {
  const body = fields.map(([key, value]) =>
    `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`
  ).join("") + `--${boundary}--\r\n`;

  return new NextRequest(requestUrl, {
    method: "POST",
    headers: { "content-type": `multipart/form-data; boundary=${boundary}` },
    body,
  });
}

describe("idempotency request content hashes", () => {
  it("ignores JSON whitespace and object-key order recursively", async () => {
    const first = await getRequestHash(jsonRequest(
      '{"email":"reader@example.com","details":{"b":2,"a":1},"items":[{"y":true,"x":null}]}'
    ));
    const second = await getRequestHash(jsonRequest(
      '{ "items": [{"x":null,"y":true}], "details": {"a":1,"b":2}, "email": "reader@example.com" }'
    ));

    expect(first).toMatch(/^[a-f0-9]{64}$/);
    expect(second).toBe(first);
  });

  it("distinguishes changed JSON fields and array order", async () => {
    const original = await getRequestHash(jsonRequest('{"email":"one@example.com","items":[1,2]}'));
    const changedEmail = await getRequestHash(jsonRequest('{"email":"two@example.com","items":[1,2]}'));
    const reversedArray = await getRequestHash(jsonRequest('{"email":"one@example.com","items":[2,1]}'));

    expect(changedEmail).not.toBe(original);
    expect(reversedArray).not.toBe(original);
  });

  it("ignores multipart boundaries and field order but detects changed values", async () => {
    const first = await getRequestHash(multipartRequest(
      [["name", "Jane"], ["message", "Hello"]], "first-boundary"
    ));
    const reordered = await getRequestHash(multipartRequest(
      [["message", "Hello"], ["name", "Jane"]], "second-boundary"
    ));
    const changed = await getRequestHash(multipartRequest(
      [["message", "Updated message"], ["name", "Jane"]], "third-boundary"
    ));

    expect(reordered).toBe(first);
    expect(changed).not.toBe(first);
  });

  it("preserves every duplicate value and its order while sorting field names", async () => {
    const original = await getRequestHash(multipartRequest(
      [["message", "First value"], ["name", "Jane"], ["message", "Final value"]], "original"
    ));
    const reorderedNames = await getRequestHash(multipartRequest(
      [["name", "Jane"], ["message", "First value"], ["message", "Final value"]], "reordered-names"
    ));
    const changedFirst = await getRequestHash(multipartRequest(
      [["message", "Changed first"], ["name", "Jane"], ["message", "Final value"]], "changed-first"
    ));
    const reversedValues = await getRequestHash(multipartRequest(
      [["message", "Final value"], ["name", "Jane"], ["message", "First value"]], "reversed-values"
    ));

    expect(reorderedNames).toBe(original);
    expect(changedFirst).not.toBe(original);
    expect(reversedValues).not.toBe(original);
  });

  it("distinguishes a first file from a first string even when the last value matches", async () => {
    const form = new FormData();
    form.append("message", new Blob(["First value"], { type: "text/plain" }), "message.txt");
    form.append("message", "Final value");
    const firstFile = await getRequestHash(new NextRequest(requestUrl, { method: "POST", body: form }));
    const firstString = await getRequestHash(multipartRequest(
      [["message", "First value"], ["message", "Final value"]], "first-string"
    ));

    expect(firstFile).not.toBe(firstString);
  });

  it("includes file names, media types, and bytes without including multipart boundaries", async () => {
    async function fileHash(name: string, type: string, content: string) {
      const form = new FormData();
      form.append("attachment", new Blob([content], { type }), name);
      return getRequestHash(new NextRequest(requestUrl, { method: "POST", body: form }));
    }

    const original = await fileHash("first.txt", "text/plain", "first content");
    expect(await fileHash("first.txt", "text/plain", "first content")).toBe(original);
    expect(await fileHash("second.txt", "text/plain", "first content")).not.toBe(original);
    expect(await fileHash("first.txt", "text/csv", "first content")).not.toBe(original);
    expect(await fileHash("first.txt", "text/plain", "other content")).not.toBe(original);
  });

  it("treats equivalent form encodings alike while separating JSON semantics", async () => {
    const encodedForm = await getRequestHash(new NextRequest(requestUrl, {
      method: "POST",
      body: new URLSearchParams({ message: "Hello there" }),
    }));
    const multipartForm = await getRequestHash(multipartRequest(
      [["message", "Hello there"]], "same-fields"
    ));
    const json = await getRequestHash(jsonRequest('{"message":"Hello there"}'));

    expect(encodedForm).toBe(multipartForm);
    expect(json).not.toBe(encodedForm);
  });

  it("leaves the original request body available for route parsing", async () => {
    const request = jsonRequest('{"email":"reader@example.com"}');
    await getRequestHash(request);

    expect(request.bodyUsed).toBe(false);
    await expect(request.json()).resolves.toEqual({ email: "reader@example.com" });
  });

  it("rejects malformed input so admission can return a parse error", async () => {
    await expect(getRequestHash(jsonRequest('{"email":'))).rejects.toThrow();
  });
});
