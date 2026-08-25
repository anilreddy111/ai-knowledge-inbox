import ReactMarkdown from "react-markdown";
import type { QueryResponse } from "../services/api";

interface AnswerProps {
  result: QueryResponse | null;
}

function Answer({ result }: AnswerProps) {
  if (!result) {
    return null;
  }

  return (
    <section>
      <h2>Answer</h2>

      <div className="answer">
        <ReactMarkdown>
          {result.answer}
        </ReactMarkdown>
      </div>

      {result.sources.length > 0 && (
        <>
          <h3>Sources</h3>

          {result.sources.map((source, index) => (
            <article
              key={`${source.itemId}-${index}`}
            >
              <strong>{source.title}</strong>

              <p>{source.snippet}</p>

              <small>
                Relevance: {source.score.toFixed(3)}
              </small>

              {source.sourceUrl && (
                <a
                  href={source.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View source
                </a>
              )}
            </article>
          ))}
        </>
      )}
    </section>
  );
}

export default Answer;