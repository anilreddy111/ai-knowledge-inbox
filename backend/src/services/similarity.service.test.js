import { describe, expect, it } from "vitest";
import { cosineSimilarity } from "../utils/cosine-similarity.js";

describe("cosineSimilarity", () => {
  it("returns 1 for identical vectors", () => {
    const vector = [1, 2, 3];

    expect(cosineSimilarity(vector, vector))
      .toBeCloseTo(1);
  });

  it("returns 0 for perpendicular vectors", () => {
    const vectorA = [1, 0];
    const vectorB = [0, 1];

    expect(cosineSimilarity(vectorA, vectorB))
      .toBeCloseTo(0);
  });

  it("throws when vector dimensions differ", () => {
    expect(() =>
      cosineSimilarity([1, 2], [1, 2, 3])
    ).toThrow("Vectors must have the same dimensions");
  });
});