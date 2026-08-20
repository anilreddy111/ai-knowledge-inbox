# AI Knowledge Inbox

A small local knowledge inbox that ingests notes and web pages, creates embeddings for their chunks, and answers questions using retrieval-augmented generation (RAG).

## Requirements

- Node.js 20 or newer
- A Google Gemini API key

## Setup

```bash
npm install
cp .env.example .env
```

Add a value for `GEMINI_API_KEY` in `.env`, then start the API:

```bash
npm run dev
```

The server listens on `http://localhost:3000` by default. Use `npm start` for a non-watch mode, and `npm test` to run the automated tests.

The SQLite database is created automatically at `DATABASE_PATH` (default: `./data/knowledge.db`). The database and local environment file are intentionally ignored by Git.

## API

### Health check

```bash
curl http://localhost:3000/health
```

### Ingest a note

```bash
curl -X POST http://localhost:3000/ingest \
  -H 'Content-Type: application/json' \
  -d '{"type":"note","title":"RAG notes","content":"Retrieval grounds a response in relevant source chunks."}'
```

### Ingest a URL

```bash
curl -X POST http://localhost:3000/ingest \
  -H 'Content-Type: application/json' \
  -d '{"type":"url","url":"https://example.com"}'
```

### Query the knowledge base

```bash
curl -X POST http://localhost:3000/query \
  -H 'Content-Type: application/json' \
  -d '{"question":"What does retrieval do?"}'
```

### List ingested items

```bash
curl http://localhost:3000/items
```

## Design

The backend is organized into routes, controllers, services, repositories, and validation modules. Ingestion stores the source, splits the content into chunks, and generates one embedding per chunk. Querying embeds the question, ranks stored chunks with cosine similarity, and sends the highest-ranked context to Gemini. Responses include source snippets so the result can be inspected.

SQLite and `better-sqlite3` keep local setup simple and make writes synchronous and transactional. This is appropriate for an assessment-sized local service, while a production deployment would likely move embeddings and metadata to a vector-capable database and process ingestion through a durable job queue.

## Tradeoffs and limitations

- Embeddings and generation use Gemini, so ingestion and querying require `GEMINI_API_KEY` and network access.
- Embeddings are stored as JSON in SQLite and ranked in application memory. This is easy to understand but does not scale to a large corpus.
- URL ingestion extracts readable page text but does not handle JavaScript-rendered pages, authentication, or scheduled refreshes.
- Ingestion currently processes embeddings sequentially. A production version could batch requests and expose job status for larger documents.
- There is no authentication or per-user data isolation because this assessment focuses on the core workflow.
