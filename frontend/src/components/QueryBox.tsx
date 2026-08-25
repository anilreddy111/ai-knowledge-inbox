import { useState } from "react";
import {
  queryKnowledge,
  type QueryResponse,
} from "../services/api";

interface QueryBoxProps {
  onResult: (
    result: QueryResponse
  ) => void;
}

function QueryBox({
  onResult,
}: QueryBoxProps) {
  const [question, setQuestion] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!question.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result =
        await queryKnowledge(question);

      onResult(result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to query knowledge"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Ask Your Knowledge</h2>

      <form onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(event) =>
            setQuestion(event.target.value)
          }
          placeholder="Ask something about your saved content..."
          rows={4}
        />

        {error && <p>{error}</p>}

        <button
          type="submit"
          disabled={
            loading || !question.trim()
          }
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
    </section>
  );
}

export default QueryBox;