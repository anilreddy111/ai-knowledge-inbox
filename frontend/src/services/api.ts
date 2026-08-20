const API_BASE_URL = "http://localhost:3000";

export interface Item {
  id: number;
  title: string;
  sourceType: "note" | "url";
  sourceUrl: string | null;
  createdAt: string;
}

export interface NoteInput {
  type: "note";
  title: string;
  content: string;
}

export interface UrlInput {
  type: "url";
  url: string;
}

export type IngestInput = NoteInput | UrlInput;

export interface Source {
  itemId: number;
  title: string;
  sourceType: "note" | "url";
  sourceUrl: string | null;
  snippet: string;
  score: number;
}

export interface QueryResponse {
  answer: string;
  sources: Source[];
}

export async function ingestContent(
  data: IngestInput
): Promise<Item> {
  const response = await fetch(`${API_BASE_URL}/ingest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.error || "Failed to save content"
    );
  }

  return response.json();
}

export async function getItems(): Promise<Item[]> {
  const response = await fetch(`${API_BASE_URL}/items`);

  if (!response.ok) {
    throw new Error("Failed to load items");
  }

  return response.json();
}

export async function queryKnowledge(
  question: string
): Promise<QueryResponse> {
  const response = await fetch(`${API_BASE_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
    }),
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.error || "Failed to query knowledge"
    );
  }

  return response.json();
}