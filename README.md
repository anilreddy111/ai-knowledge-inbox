# AI Knowledge Inbox

A minimal AI-powered knowledge inbox that allows users to save notes or URLs and ask questions over their saved content using a Retrieval-Augmented Generation (RAG) pipeline.

## Features

- Save plain-text notes
- Save URLs and fetch their content server-side
- Chunk saved content
- Generate embeddings using Gemini
- Store content, chunks, and embeddings in SQLite
- Perform semantic similarity search
- Retrieve the most relevant chunks for a question
- Generate grounded answers using Gemini
- Display source snippets with answers
- React + TypeScript frontend
- Structured backend logging
- Input validation and error handling

## Architecture

```text
React + TypeScript
        |
        | HTTP
        v
Express Backend
        |
   +----+----+
   |         |
 /ingest   /query
   |         |
   v         v
Content    Query
Processing Embedding
   |         |
   v         v
Chunking  Similarity Search
   |         |
   v         v
Gemini    Top-K Chunks
Embeddings   |
   |         v
   |      Gemini LLM
   |         |
   +---------+
        |
        v
      SQLite
```

## RAG Pipeline

### Ingestion

```text
Note / URL
    ↓
Extract raw content
    ↓
Chunk content
    ↓
Generate embedding for each chunk
    ↓
Store item + chunks + embeddings in SQLite
```

### Query

```text
User question
    ↓
Generate question embedding
    ↓
Calculate cosine similarity
    ↓
Retrieve top relevant chunks
    ↓
Pass context + question to Gemini
    ↓
Return answer + source snippets
```

## Tech Stack

### Backend

- Node.js 20+
- Express
- SQLite
- better-sqlite3
- Google Gemini API
- Cheerio
- Zod
- Pino / pino-http
- Vitest

### Frontend

- React
- TypeScript
- Vite
- React Markdown

## Project Structure

```text
ai-knowledge-inbox/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── errors/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validation/
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   └── services/
│   └── package.json
│
├── .gitignore
└── README.md
```

## Running Locally

### Prerequisites

- Node.js 20+
- Gemini API key

### Backend

```bash
cd backend
npm install
```

Create `backend/.env` using `backend/.env.example`:

```env
GEMINI_API_KEY=your_api_key
DATABASE_PATH=./data/knowledge.db
LOG_LEVEL=info
```

Start the backend:

```bash
npm run dev
```

Backend:

`http://localhost:3000`

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

`http://localhost:5173`

## API

### POST `/ingest`

Save a note:

```json
{
  "type": "note",
  "title": "Redis Caching",
  "content": "Redis is an in-memory data store commonly used for caching."
}
```

Save a URL:

```json
{
  "type": "url",
  "url": "https://example.com"
}
```

For URLs, the backend fetches the page and extracts readable content server-side.

### GET `/items`

Returns saved knowledge items.

### POST `/query`

Request:

```json
{
  "question": "Why is Redis useful for caching?"
}
```

Response:

```json
{
  "answer": "Redis is useful for caching because...",
  "sources": [
    {
      "itemId": 1,
      "title": "Redis Caching",
      "sourceType": "note",
      "sourceUrl": null,
      "snippet": "Redis is an in-memory data store...",
      "score": 0.75
    }
  ]
}
```

## Design Decisions and Tradeoffs

### Chunking

A simple intentional chunking strategy is used to keep the implementation understandable and appropriate for the assignment's timebox.

For a larger system, chunking could consider document structure, paragraphs, headings, semantic boundaries, and overlap.

### Vector Storage

SQLite is used for persistence, while embeddings are stored with chunks and cosine similarity is calculated in the application.

This avoids introducing a dedicated vector database for a small single-user application.

At larger scale, PostgreSQL with pgvector or a dedicated vector database would be more appropriate.

### Synchronous Ingestion

The current ingestion flow is:

```text
fetch
  ↓
chunk
  ↓
embed
  ↓
store
```

This keeps the implementation simple and easy to debug.

For production, this could become an asynchronous worker-based pipeline:

```text
POST /ingest
    ↓
Create job
    ↓
Queue
    ↓
Worker
    ↓
Fetch / chunk / embed
    ↓
Store
```

### Error Handling

The backend uses meaningful HTTP status codes:

- `400` — invalid request
- `422` — unusable content
- `502` — external service failure
- `504` — external request timeout
- `500` — unexpected server error

### Debuggability

Pino and pino-http provide structured logging for HTTP requests, ingestion, queries, and errors.

## What Breaks at Scale?

This implementation is intentionally optimized for a small single-user application.

At larger scale:

- Application-side vector search becomes expensive.
- Synchronous ingestion becomes slow.
- SQLite becomes unsuitable for concurrent workloads.
- Large document processing needs background workers.
- Multiple users require authentication and authorization.
- URL fetching requires stronger SSRF protection.
- Rate limiting becomes necessary.

## Production Improvements

If this needed to support many users and significantly more data, I would consider:

1. PostgreSQL + pgvector
2. Background ingestion workers
3. A job queue
4. Authentication and authorization
5. Rate limiting
6. Stronger URL/SSRF protection
7. Streaming LLM responses
8. Observability and metrics
9. Caching
10. More sophisticated document parsing and chunking
11. Hybrid keyword + vector retrieval

These are intentionally not included because the assignment is timeboxed and explicitly asks to avoid unnecessary infrastructure.

## Testing

Backend tests cover core deterministic logic including:

- Text chunking
- Cosine similarity

Run:

```bash
cd backend
npm test
```

## Scope

This project intentionally avoids:

- Full authentication systems
- Kubernetes
- Microservices
- Complex infrastructure
- Dedicated vector databases
- Unnecessary state-management libraries

The goal is to demonstrate a clear end-to-end implementation with sensible engineering tradeoffs.