import { useState } from "react";
import {
  ingestContent,
  type IngestInput,
} from "../services/api";

interface AddContentProps {
  onSaved: () => Promise<void>;
}

function AddContent({ onSaved }: AddContentProps) {
  const [type, setType] = useState<"note" | "url">("note");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      let data: IngestInput;

      if (type === "note") {
        data = {
          type: "note",
          title,
          content,
        };
      } else {
        data = {
          type: "url",
          url,
        };
      }

      await ingestContent(data);

      setTitle("");
      setContent("");
      setUrl("");

      await onSaved();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save content"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h2>Add Content</h2>
<div>
     <button
  type="button"
  className={type === "note" ? "active" : ""}
  onClick={() => setType("note")}
>
  Note
</button>

       <button
  type="button"
  className={type === "url" ? "active" : ""}
  onClick={() => setType("url")}
>
  URL
</button>
      </div>

      <form onSubmit={handleSubmit}>
        {type === "note" ? (
          <>
            <div>
              <label htmlFor="title">
                Title
              </label>

              <input
                id="title"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="e.g. Redis Caching"
                required
              />
            </div>

            <div>
              <label htmlFor="content">
                Note
              </label>

              <textarea
                id="content"
                value={content}
                onChange={(event) =>
                  setContent(event.target.value)
                }
                placeholder="Write your note..."
                rows={6}
                required
              />
            </div>
          </>
        ) : (
          <div>
            <label htmlFor="url">
              URL
            </label>

            <input
              id="url"
              type="url"
              value={url}
              onChange={(event) =>
                setUrl(event.target.value)
              }
              placeholder="https://example.com/article"
              required
            />
          </div>
        )}

        {error && <p>{error}</p>}

        <button
          type="submit"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </section>
  );
}

export default AddContent;