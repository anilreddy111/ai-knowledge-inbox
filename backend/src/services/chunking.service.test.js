import { describe, expect, it } from "vitest";
import { chunkText } from "../utils/chunking.js";

describe("chunkText", () => {
  it("returns one chunk for short text", () => {
    const text = "Redis is an in-memory data store.";

    const chunks = chunkText(text);

    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe(text);
  });

  it("splits long text into overlapping chunks", () => {
    const text = "a".repeat(1200);

    const chunks = chunkText(text);

    expect(chunks).toHaveLength(3);
    expect(chunks[0]).toHaveLength(500);
    expect(chunks[1]).toHaveLength(500);
    expect(chunks[2]).toHaveLength(400);
  });
});
